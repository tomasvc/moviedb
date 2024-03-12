import React from "react";

export const SettingsPanel = () => {
  return (
    <div className="bg-white shadow rounded-md w-full md:w-60">
      <div className="bg-blue-600 text-white text-md tracking-wide px-6 py-5 rounded-tl-md rounded-tr-md">
        Settings
      </div>
      <div>
        <ul className="flex flex-col gap-4 p-6 font-light text-[0.9rem]">
          <li>
            <a href="/account">Edit Profile</a>
          </li>
          <li>
            <a href="/account">Account Settings</a>
          </li>
          <li>
            <a href="/account">Delete Account</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
