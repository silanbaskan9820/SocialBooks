import { Link } from "react-router-dom";
import { UserPen, Lock, Palette, Bell, LogOut, ChevronRight, Settings, Check, Mail, Key, Info } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { changeEmail, changePassword, updateNotificationSettings, deleteAccount, updatePrivacySettings, updateLanguage } from "../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SettingsPage = () => {

  const {user: currentUser, setUser: setCurrentUser} = useContext(AuthContext);

  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingPassword, setSavingPassword] = useState(false);

  const [savingPreferences, setSavingPreferences] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);

  const [emailForm, setEmailForm] = useState({
   email: "",
   password:"",
  });

  const [savingEmail, setSavingEmail] = useState(false);

  const [privacySettings, setPrivacySettings] = useState(
    currentUser?.privacy || {
      privateAccount: false,
      showEmail: false,
      showFollowers: true,
      showFollowing: true,
    }
  );

  const [savingPrivacy, setSavingPrivacy] = useState(false);

  const [language, setLanguage] = useState(
    currentUser?.language || "en"
  );

  const [savingLanguage, setSavingLanguage] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState(
  currentUser?.notificationSettings || {
    likes: true,
    comments: true,
    follows: true,
    system: true,
  }
);

  const { theme, setTheme } = useContext(ThemeContext);

  const themes = [
    {
      value: "light",
      label: "Light",
      color: "bg-white border",
    },
    {
      value: "dark",
      label: "Dark",
      color: "bg-gray-900",
    },
    {
      value: "forest",
      label: "Forest",
      color: "bg-green-700",
    },
    {
      value: "emerald",
      label: "Emerald",
      color: "bg-emerald-500",
    },
    {
      value: "dracula",
      label: "Dracula",
      color: "bg-purple-700",
    },
    {
      value: "corporate",
      label: "Corporate",
      color: "bg-blue-600",
    },
    {
      value: "cupcake",
      label: "Cupcake",
      color: "bg-pink-300"
    },
    {
      value: "night",
      label: "Night",
      color: "bg-slate-800",
    },
  ];

  const { t, i18n } = useTranslation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");

  const [deleting, setDeleting] = useState(false);

  const handleChangeEmail = async () => {

    if( emailForm.newEmail !== emailForm.confirmEmail ) {
      toast.error("Email do not match.");
      return;
    }

    try {
      setSavingEmail(true);

      await changeEmail({
        currentEmail: emailForm.currentEmail,
        newEmail: emailForm.newEmail,
      });

      toast.success("Email updated successfully.")

      setShowEmailModal(false);

      setEmailForm({
        Email: "",
        Password: "",
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Email update failed.")
    } finally {
      setSavingEmail(false);
    }
  }

  const handleChangePassword = async () => {

    if( passwordForm.newPassword !== passwordForm.confirmPassword ) {
      toast.error("Password do not match.");
      return;
    }

    try {
      setSavingPassword(true);

      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password updated successfully.")

      setShowPasswordModal(false);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed.")
    } finally {
      setSavingPassword(false);
    }
  }

  const handleNotificationSettings = async () => {
    setSavingPreferences (true);

    try {
      const updatedUser = await updateNotificationSettings(
            currentUser._id,
            notificationSettings
        );

        setCurrentUser(updatedUser);

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        toast.success("Notification preferences updated.");

    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save preferences.");
    }

  };

  const handleDeleteAccount = async () => {

    if(!deletePassword) {
      toast.error("Please enter your password.")

      return;
    }
     try {

      setDeleting(true);

      await deleteAccount(currentUser._id, deletePassword);

      toast.success("Account deleted");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
     } catch (error) {

      toast.error(
        error.response?.data?.message || "Could not be delete account."
      )
     } finally {
      setDeleting(false);
     }
  };

  const handlePrivacySettings = async () => {
    try {
      setSavingPrivacy(true);

      await updatePrivacySettings(
        currentUser._id,
        privacySettings
      );

      const updatedUser = {
        ...currentUser,
        privacy: privacySettings,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setCurrentUser(updatedUser);

      toast.success("Privacy settings updated.");

    } catch (error) {
      if(error.response?.status===403) {
        toast.error("This account is private.");
      } else {
        toast.error("User could not be loaded.");
      }

    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleLanguage = async () => {
    try {
       setSavingLanguage(true);

       const updatedUser = await updateLanguage(
        currentUser._id,
        language
       );

       console.log("Updated User: ", updatedUser);

       setCurrentUser(updatedUser);

       localStorage.setItem("user", JSON.stringify(updatedUser));

       i18n.changeLanguage(language);

       toast.success("Language updated.")

    } catch (error) {

      console.log(error.response);
    console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Language could not be updated")
    } finally{
        setSavingLanguage(false);
    }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);

    toast.success("Logged out successfully.");

    navigate("/login");
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Settings className="text-primary" />
          {t("settings")}
        </h1>

        <p className="text-base-content/60 mt-2">
           {t("settingsDescription")}
        </p>
      </div>

      <div className="space-y-5">

        <div className="card bg-base-100 shadow">

          <div className="card-body">

            <h2 className="card-title mb-2">
             {t("account")}
            </h2>

            <Link
              to={`/profile/${currentUser._id}?edit=true`}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-base-200 transition"
            >
              <div className="flex items-center gap-4">

                <div className="bg-primary/10 p-3 rounded-xl">
                  <UserPen className="text-primary" />
                </div>

                <div>
                  <p className="font-semibold">
                    {t("editProfile")}
                  </p>

                  <p className="text-sm opacity-60">
                    {t("updateProfile")}
                  </p>
                </div>

              </div>

              <ChevronRight />
            </Link>

            {/* Change Email */}
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-base-200 transition text-left w-full"
            >
              <div className="flex items-center gap-4">

                <div className="bg-warning/10 p-3 rounded-xl">
                  <Mail className="text-success" />
                </div>

                <div>
                  <p className="font-semibold">
                    {t("changeEmail")}
                  </p>

                  <p className="text-sm opacity-60">
                    {t("changeEmailDescription")}
                  </p>
                </div>

              </div>

              <ChevronRight />
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-base-200 transition text-left w-full"
            >
              <div className="flex items-center gap-4">

                <div className="bg-warning/10 p-3 rounded-xl">
                  <Lock className="text-warning" />
                </div>

                <div>
                  <p className="font-semibold">
                    {t("changePassword")}
                  </p>

                  <p className="text-sm opacity-60">
                    {t("changePasswordDescription")}
                  </p>
                </div>

              </div>

              <ChevronRight />
            </button>

          </div>

        </div>

    {/* Preferences */}

        <div className="card bg-base-100 shadow">

          <div className="card-body">

            <h2 className="card-title mb-2">
              {t("preferences")}
            </h2>

            {/* Appearance */}

            <div className="flex items-center justify-between p-4 rounded-xl">

    <div className="flex items-center gap-4">

        <div className="bg-secondary/10 p-3 rounded-xl">
            <Palette className="text-secondary" />
        </div>

        <div>

            <p className="font-semibold">
                {t("appearance")}
            </p>

            <p className="text-sm opacity-60">
                {t("appearanceDescription")}
            </p>

        </div>

    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {themes.map((item) => (

      <button
         key={item.value}
         onClick={() => setTheme(item.value)}
         className={`border rounded-2xl p-4 transition hover:shadow-lg
         ${theme === item.value
          ? "border-primary ring-2 ring-primary"
          : "border-base-300"
         }`}
        >

        <div className="flex justify-center gap-2 mb-3">
          <div className={`w-6 h-6 rounded-full ${item.color}`}></div>
          <div className="w-6 h-6 rounded-full bg-primary"></div>
          <div className="w-6 h-6 rounded-full bg-secondary"></div>
        </div>

        <p className="font-semibold">
          {item.label}
        </p>

        {theme === item.value && (
        <p className="text-primary text-sm mt-1">
          {t("Selected")}
        </p>
        )}
      </button>
      ))}
    </div>
</div>

<div className="flex justify-between items-center p-4 rounded-xl">
  <div>
    <p className="font-semibold">
      {t("language")}
    </p>

    <p className="text-sm opacity-60">
      {t("languageDescription")}
    </p>
  </div>

  <div className="flex gap-3 items-center">

    <select
    className="select select-bordered"
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="en">🇬🇧 English</option>
      <option value="tr">🇹🇷 Türkçe</option>
    </select>

    <button
       className="btn btn-success"
       onClick={handleLanguage}
       disabled={savingLanguage}
    >
      {savingLanguage
 ? t("saving")
 : t("save")}
    </button>
  </div>
</div>
            {/* Notifications */}

<div className="flex items-start gap-4 p-4">

  <div className="bg-info/10 p-3 rounded-xl">
    <Bell className="text-info" />
  </div>

  <div className="flex-1">

    <p className="font-semibold mb-4">
      {t("notificationPreferences")}
    </p>

    <div className="space-y-4">

      <div className="flex justify-between items-center">
        <div>
          <p className="font-small">{t("likes")}</p>
          <p className="text-sm opacity-60">
            {t("likesDescription")}
          </p>
        </div>

        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={notificationSettings.likes}
          onChange={(e)=>
            setNotificationSettings({
              ...notificationSettings,
              likes:e.target.checked
            })
          }
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="font-small">{t("comments")}</p>
          <p className="text-sm opacity-60">
            {t("commentsDescription")}
          </p>
        </div>

        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={notificationSettings.comments}
          onChange={(e)=>
            setNotificationSettings({
              ...notificationSettings,
              comments:e.target.checked
            })
          }
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="font-small">{t("followers")}</p>
          <p className="text-sm opacity-60">
            {t("followersDescription")}
          </p>
        </div>

        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={notificationSettings.follows}
          onChange={(e)=>
            setNotificationSettings({
              ...notificationSettings,
              follows:e.target.checked
            })
          }
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="font-small">{t("system")}</p>
          <p className="text-sm opacity-60">
            {t("systemDescription")}
          </p>
        </div>

        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={notificationSettings.system}
          onChange={(e)=>
            setNotificationSettings({
              ...notificationSettings,
              system:e.target.checked
            })
          }
        />
      </div>

      <button
        className="btn btn-success mt-3"
        onClick={handleNotificationSettings}
        disabled={savingPreferences}
      >
        <Check size={18}/>
        {savingPreferences
 ? t("savingPreferences")
 : t("savePreferences")}
      </button>

    </div>

  </div>

</div>

<div className="flex items-start gap-4 p-4">

    <div className="bg-info/10 p-3 rounded-xl">
    <Key className="text-info" />
  </div>

    <div className="flex-1">

    <h2 className="font-semibold mb-4">
      {t("privacyPreferences")}
    </h2>

    <div className="space-y-4">

      {/* Private Account */}

      <div className="flex justify-between items-center">

        <div>

          <p className="font-small">
            {t("privateAccount")}
          </p>

          <p className="text-sm opacity-60">
            {t("viewProfile")}
          </p>

        </div>

        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={privacySettings.privateAccount}
          onChange={(e)=>
            setPrivacySettings({
              ...privacySettings,
              privateAccount:e.target.checked
            })
          }
        />

      </div>

      {/* Show Email */}

      <div className="flex justify-between items-center">

        <div>

          <p className="font-small">
            {t("showEmail")}
          </p>

          <p className="text-sm opacity-60">
            {t("allowEmail")}
          </p>

        </div>

        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={privacySettings.showEmail}
          onChange={(e)=>
            setPrivacySettings({
              ...privacySettings,
              showEmail:e.target.checked
            })
          }
        />

      </div>

      {/* Show Followers */}

      <div className="flex justify-between items-center">

        <div>

          <p className="font-small">
            {t("showFollowers")}
          </p>

        </div>

        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={privacySettings.showFollowers}
          onChange={(e)=>
            setPrivacySettings({
              ...privacySettings,
              showFollowers:e.target.checked
            })
          }
        />

      </div>

      {/* Show Following */}

      <div className="flex justify-between items-center">

        <div>

          <p className="font-small">
            {t("showFollowing")}
          </p>

        </div>

        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={privacySettings.showFollowing}
          onChange={(e)=>
            setPrivacySettings({
              ...privacySettings,
              showFollowing:e.target.checked
            })
          }
        />

      </div>

      <button
        className="btn btn-success mt-4"
        onClick={handlePrivacySettings}
        disabled={savingPrivacy}
      >
        <Check size={18}/>
        {savingPrivacy
 ? t("saving")
 : t("savePrivacy")}
      </button>

    </div>

  </div>

</div>

          </div>

        </div>

        <div className="card bg-base-100 shadow">

          <div className="card-body">

            <button
              onClick={handleLogout}
              className="btn btn-error btn-outline gap-2 w-fit"
            >
              <LogOut size={18} />
              {t("logout")}
            </button>

          </div>

        </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-5">
              {t("changeEmail")}
            </h2>

            <input
            type="text"
            placeholder="Email"
            className="input input-bordered w-full mb-3"
            value={emailForm.email}
            onChange={(e) => setEmailForm({
              ...emailForm, email:e.target.value
            })}
            />

            <input
            type="text"
            placeholder="Password"
            className="input input-bordered w-full mb-3"
            value={emailForm.password}
            onChange={(e) => setEmailForm({
              ...emailForm, password:e.target.value
            })}
            />

            <div className="flex justify-end gap-3">
              <button 
              className="btn btn-outline"
              onClick={() => {
                setShowEmailModal(false);

                setEmailForm({
                  Email:"",
                  Password:"",
                });
              }}
              > {t("Cancel")} </button>

              <button 
              className="btn btn-success"
              onClick={handleChangeEmail}
              disabled={savingEmail}
              > 
              <Check size={18}/>
              {savingEmail ? "Saving..." : "Save"} </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-5">
              {t("changePassword")}
            </h2>

            <input
            type="password"
            placeholder="Current Password"
            className="input input-bordered w-full mb-3"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({
              ...passwordForm, currentPassword:e.target.value
            })}
            />

            <input
            type="password"
            placeholder="New Password"
            className="input input-bordered w-full mb-3"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({
              ...passwordForm, newPassword:e.target.value
            })}
            />

            <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full mb-3"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({
              ...passwordForm, confirmPassword:e.target.value
            })}
            />

            <div className="flex justify-end gap-3">
              <button 
              className="btn btn-outline"
              onClick={() => {
                setShowPasswordModal(false);

                setPasswordForm({
                  currentPassword:"",
                  newPassword:"",
                  confirmPassword:"",
                });
              }}
              > Cancel </button>

              <button 
              className="btn btn-success"
              onClick={handleChangePassword}
              disabled={savingPassword}
              > 
              <Check size={18}/>
              {savingPassword ? "Saving..." : "Save"} </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-error mb-3">
              {t("deleteAccount")}
            </h2>

            <p className="opacity-70 mb-5">
              {t("deleteWarning")}
            </p>

            <input 
               type="password"
               className="input input-bordered w-full"
               placeholder="Password"
               value={deletePassword}
               onChange={(e) => setDeletePassword(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6">

              <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}>
                    {t("cancel")}
              </button>

              <button
                 className="btn btn-error"
                 disabled={deleting}
                 onClick={handleDeleteAccount}
              >
                {deleting 
                    ? "Deleting..."
                    : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card bg-base-100 border border-error shadow">
       
        <div className="card-body">

          <h2 className="card-title text-error">
            {t("deleteWarning")}
          </h2>

          <p className="text-sm opacity-70">
             {t("accountDeleteWarning")}
          </p>

          <button
            className="btn btn-error mt-4 w-fit"
            onClick={() => setShowDeleteModal(true)}
          >
            {t("delete")}
          </button>
        </div>
      </div> 

      <div className="card bg-base-100 shadow">
          <div className="card-body">

            <h2 className="card-title gap-2">
              <Info size={20}/>
              {t("versionInformation")}
            </h2>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span>{t("application")}</span>
                <span className="font-semibold">SocialBooks</span>
              </div>

              <div className="flex justify-between">
                <span>Version</span>
                <span>v1.0.0</span>
              </div>

              <div className="flex justify-between">
                <span>{t("build")}</span>
                <span>{t("publishDate")}</span>
              </div>
              
              <div flex justify-between>
                <span>Developer </span>
                <span>Şilan Başkan</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;