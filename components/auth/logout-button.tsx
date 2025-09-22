import { nextAuthSignOut } from "@/services/actions/nextauth-actions";
import { LogOut } from "lucide-react";
import React from "react";

const LogoutButton = () => {
  return (
    <form action={nextAuthSignOut}>
      <button type="submit">
        <div className="flex gap-2">
          <LogOut /> تسجيل خروج
        </div>
      </button>
    </form>
  );
};
export default LogoutButton;
