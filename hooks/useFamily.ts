// hooks/useFamily.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "./useAuth";

/**
 * Hook to manage family groups.
 * Provides functions to create a family, invite members, accept invites, and list members.
 */
export const useFamily = () => {
    const { user } = useAuth();
    const [familyId, setFamilyId] = useState<string | null>(null);
    const [familyName, setFamilyName] = useState<string>("");
    const [members, setMembers] = useState<Array<{ user_id: string; role: string }>>([]);
    const [invites, setInvites] = useState<Array<{ id: string; email: string; token: string; status: string }>>([]);
    const [loading, setLoading] = useState(false);

    // Load current family (if any) for the logged‑in user
    const loadCurrentFamily = useCallback(async () => {
        if (!user?.id) return;

        try {
            // Try to get family via RPC if it exists, otherwise check user_families table
            const { data, error } = await supabase
                .from("user_families")
                .select("family_id, families(name)")
                .eq("user_id", user.id)
                .limit(1)
                .single();

            if (!error && data) {
                setFamilyId(data.family_id);
                setFamilyName((data as any).families?.name || "");
            }
        } catch (err) {
            // No family found, that's okay
            setFamilyId(null);
        }
    }, [user?.id]);

    // Load members of the current family
    const loadMembers = useCallback(async (fid: string) => {
        const { data, error } = await supabase
            .from("user_families")
            .select("user_id, role")
            .eq("family_id", fid);
        if (error) console.error("Failed to load family members", error);
        else setMembers(data ?? []);
    }, []);

    // Load pending invites created by the current user
    const loadInvites = useCallback(async () => {
        if (!user?.id) return;

        const { data, error } = await supabase
            .from("family_invites")
            .select("id, email, token, status")
            .eq("created_by", user.id);
        if (error) console.error("Failed to load invites", error);
        else setInvites(data ?? []);
    }, [user?.id]);

    // Create a new family (owner becomes created_by)
    const createFamily = useCallback(async (name: string) => {
        if (!user?.id) throw new Error("User not authenticated");
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from("families")
                .insert({ name, created_by: user.id } as any)
                .select("id")
                .single();
            if (error) throw error;

            const newFamilyId = data.id as string;
            // add the creator as member with role 'owner'
            await supabase.from("user_families").insert({
                user_id: user.id,
                family_id: newFamilyId,
                role: "owner"
            } as any);

            setFamilyId(newFamilyId);
            setFamilyName(name);
            await loadMembers(newFamilyId);
            return newFamilyId;
        } finally {
            setLoading(false);
        }
    }, [user?.id, loadMembers]);

    // Invite a user by e‑mail (creates a token)
    const inviteMember = useCallback(async (email: string) => {
        if (!familyId) throw new Error("No family selected");
        const { error } = await supabase.from("family_invites").insert({
            family_id: familyId,
            email
        } as any);
        if (error) throw error;
        await loadInvites();
    }, [familyId, loadInvites]);

    // Accept an invitation using the token (called from the invited user)
    const acceptInvite = useCallback(async (token: string) => {
        if (!user?.id) throw new Error("User not authenticated");

        // Find the invite
        const { data: invite, error: fetchErr } = await supabase
            .from("family_invites")
            .select("id, family_id, status")
            .eq("token", token)
            .single();
        if (fetchErr) throw fetchErr;
        if (invite.status !== "pending") throw new Error("Invite not pending");

        // Add user to family_members
        await supabase.from("user_families").insert({
            user_id: user.id,
            family_id: invite.family_id,
            role: "member"
        } as any);

        // Mark invite as accepted
        await supabase.from("family_invites").update({ status: "accepted" } as any).eq("id", invite.id);

        // Refresh current family
        setFamilyId(invite.family_id);
        await loadMembers(invite.family_id);
    }, [user?.id, loadMembers]);

    // Leave current family
    const leaveFamily = useCallback(async () => {
        if (!user?.id || !familyId) return;
        await supabase.from("user_families").delete().eq("user_id", user.id).eq("family_id", familyId);
        setFamilyId(null);
        setMembers([]);
    }, [user?.id, familyId]);

    // Effect: load family on mount / auth change
    useEffect(() => {
        if (user?.id) {
            loadCurrentFamily();
        } else {
            setFamilyId(null);
            setMembers([]);
        }
    }, [user?.id, loadCurrentFamily]);

    // Effect: when familyId changes, load members
    useEffect(() => {
        if (familyId) loadMembers(familyId);
    }, [familyId, loadMembers]);

    // Effect: load invites for the owner
    useEffect(() => {
        if (familyId) loadInvites();
    }, [familyId, loadInvites]);

    return {
        familyId,
        setFamilyId,
        familyName,
        members,
        invites,
        loading,
        createFamily,
        inviteMember,
        acceptInvite,
        leaveFamily,
        setFamilyName,
        loadCurrentFamily,
    };
};
