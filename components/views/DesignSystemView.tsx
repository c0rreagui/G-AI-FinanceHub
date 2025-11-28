import React from 'react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

export const DesignSystemView: React.FC = () => {
    return (
        <div className="p-8 space-y-12 pb-24 overflow-y-auto h-full">
            <div className="space-y-4">
                <h1 className="text-4xl font-heading font-bold text-white">Design System Showcase</h1>
                <p className="text-muted-foreground text-lg">Verification of tokens, typography, and core components.</p>
            </div>

            {/* Typography Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-heading font-semibold text-primary border-b border-border pb-2">Typography</h2>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Headings (Outfit/Space Grotesk)</p>
                        <h1 className="text-5xl font-heading font-bold">Heading 1</h1>
                        <h2 className="text-4xl font-heading font-bold">Heading 2</h2>
                        <h3 className="text-3xl font-heading font-bold">Heading 3</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Body (Inter)</p>
                        <p className="text-base">The quick brown fox jumps over the lazy dog. (Base)</p>
                        <p className="text-sm text-muted-foreground">The quick brown fox jumps over the lazy dog. (Muted Small)</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Tabular Nums (JetBrains Mono)</p>
                        <div className="tabular-nums text-xl">
                            <p>R$ 1.234,56</p>
                            <p>R$ 9.876,54</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Buttons Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-heading font-semibold text-primary border-b border-border pb-2">Buttons</h2>
                <div className="flex flex-wrap gap-4">
                    <Button variant="default">Primary Action</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="premium">Premium AI</Button>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">icon</Button>
                </div>
            </section>

            {/* Inputs Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-heading font-semibold text-primary border-b border-border pb-2">Inputs & Forms</h2>
                <div className="grid max-w-sm gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input type="email" id="email" placeholder="name@example.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" placeholder="••••••••" />
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-heading font-semibold text-primary border-b border-border pb-2">Cards (Glassmorphism)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Revenue</CardTitle>
                            <CardDescription>Monthly overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold tabular-nums text-white">$45,231.89</div>
                        </CardContent>
                        <CardFooter>
                            <p className="text-sm text-emerald-400">+20.1% from last month</p>
                        </CardFooter>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Premium Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>This card uses a custom gradient background.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};
