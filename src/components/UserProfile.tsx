import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserProfileProps = {
    user?: KindeUser<unknown>;
};
export default function UserProfile({ user }: UserProfileProps) {
    return (
        <div className="profile-blob">
            {user?.picture ? (
                <div className="profile-image">
                    <Avatar>
                        <AvatarImage src={user?.picture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            ) : (
                <div className="avatar">
                    {user?.given_name?.[0]}
                    {user?.family_name?.[0]}
                </div>
            )}
            <div>
                <p className="text-heading-2 font-medium">
                    {user?.given_name} {user?.family_name}
                </p>

                <LogoutLink className="text-subtle">Log out</LogoutLink>
            </div>
        </div>
    )
}