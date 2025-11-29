import { useDialog } from '../../hooks/useDialog';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { Progress } from '../ui/Progress';
import { Trophy } from '../Icons';

export const UserLevelBar: React.FC = () => {
    const { userLevel } = useDashboardData();
    const { openDialog } = useDialog();

    if (!userLevel) return null;

    const progress = (userLevel.xp / userLevel.xpToNextLevel) * 100;

    return (
        <div className="w-full max-w-xs">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div 
                            className="flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openDialog('achievements')}
                        >
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span className="flex items-center gap-1 font-bold text-yellow-500">
                                    <Trophy className="w-3 h-3" />
                                    Nível {userLevel.level}
                                </span>
                                <span>{Math.floor(userLevel.xp)} / {userLevel.xpToNextLevel} XP</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-secondary" indicatorClassName="bg-gradient-to-r from-yellow-500 to-orange-500" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Rank: {userLevel.rank}</p>
                        <p>Clique para ver suas conquistas!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};
