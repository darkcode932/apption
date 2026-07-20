"use client";

import React, { useEffect, useState } from "react";
import { HiMagnifyingGlass, HiCheckBadge } from "react-icons/hi2";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAllUsersUseCase,
  updateUserRoleUseCase,
  setUserVerificationUseCase,
} from "../../../infrastructure/ServiceLocator";
import { User } from "../../../domain/entities/User";
import { Input } from "../../components/Input";
import ButtonClick from "../../components/ButtonClick";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Verification Modal states
  const [verifyingUser, setVerifyingUser] = useState<User | null>(null);
  const [officialTitle, setOfficialTitle] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function loadUsers() {
    try {
      const data = await getAllUsersUseCase.execute();
      setUsers(data);
    } catch (e) {
      console.error("Failed to load users:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleToggle = async (targetUser: User) => {
    if (currentUser?.role !== "super_admin") {
      alert("Seuls les Super Administrateurs peuvent modifier les rôles.");
      return;
    }

    if (targetUser.id === currentUser.id) {
      alert("Vous ne pouvez pas modifier votre propre rôle.");
      return;
    }

    const newRole = targetUser.role === "admin" ? "user" : "admin";
    const confirmMsg = `Voulez-vous vraiment changer le rôle de ${targetUser.firstname} en ${
      newRole === "admin" ? "Administrateur" : "Utilisateur Standard"
    } ?`;

    if (!confirm(confirmMsg)) return;

    try {
      setLoading(true);
      await updateUserRoleUseCase.execute(targetUser.id, newRole);
      await loadUsers();
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de la modification du rôle.");
      setLoading(false);
    }
  };

  const handleOpenVerifyModal = (targetUser: User) => {
    setVerifyingUser(targetUser);
    setOfficialTitle(targetUser.officialTitle || "");
  };

  const handleSaveVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingUser) return;

    setActionLoading(true);
    try {
      await setUserVerificationUseCase.execute(verifyingUser.id, true, officialTitle.trim());
      setVerifyingUser(null);
      setOfficialTitle("");
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la vérification.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveVerification = async (targetUser: User) => {
    if (!confirm(`Retirer le badge certifié pour ${targetUser.firstname} ?`)) return;

    setLoading(true);
    try {
      await setUserVerificationUseCase.execute(targetUser.id, false, "");
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert("Erreur lors du retrait de la certification.");
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstname} ${u.lastname}`.toLowerCase();
    const username = (u.username || "").toLowerCase();
    const email = u.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || username.includes(search) || email.includes(search);
  });

  const isSuperAdmin = currentUser?.role === "super_admin";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-4 text-xs text-neutral-450 italic">Chargement de l&apos;annuaire...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">
          Gestion des Utilisateurs
        </h1>
        <p className="text-xs sm:text-sm text-neutral-450 mt-1.5 font-light">
          Attribuez des rôles administratifs ou certifiez des comptes officiels pour répondre aux pétitions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md relative z-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <HiMagnifyingGlass className="h-5 w-5 text-neutral-500" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom, pseudo ou email..."
          className="block w-full rounded-2xl border border-white/5 bg-neutral-950/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10 transition-all"
        />
      </div>

      {/* Users Table Grid */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative z-10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5 text-left text-sm">
            <thead className="bg-neutral-950/50 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Utilisateur</th>
                <th className="py-4 px-6">Adresse Email</th>
                <th className="py-4 px-6">Rôle</th>
                <th className="py-4 px-6">Statut Officiel</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-neutral-250">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                  
                  {/* Name & Avatar */}
                  <td className="py-4 px-6 flex items-center space-x-3 min-w-[200px]">
                    <div className="h-8 w-8 rounded-full bg-neutral-900 flex items-center justify-center text-xs font-bold text-green-400 border border-white/5 uppercase">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} className="h-full w-full object-cover rounded-full" alt="" />
                      ) : (
                        u.username?.charAt(0) || u.firstname.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white leading-none">
                        {u.firstname} {u.lastname}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        @{u.username || "sans_pseudo"}
                      </p>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 text-neutral-400 select-all font-light">
                    {u.email}
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-full tracking-wider ${
                      u.role === "super_admin"
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : u.role === "admin"
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-neutral-900 border border-white/5 text-neutral-500"
                    }`}>
                      {u.role === "super_admin" ? "Super Admin" : u.role === "admin" ? "Admin" : "Membre"}
                    </span>
                  </td>

                  {/* Official badge status */}
                  <td className="py-4 px-6 min-w-[160px]">
                    {u.isVerified ? (
                      <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-xs bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full w-fit">
                        <HiCheckBadge className="text-sm flex-shrink-0" />
                        <span className="truncate max-w-[120px]">{u.officialTitle || "Certifié"}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-500 text-xs font-light italic">Non certifié</span>
                    )}
                  </td>

                  {/* Actions buttons */}
                  <td className="py-4 px-6 text-right space-x-2.5 whitespace-nowrap">
                    {/* Role Promotion (Super Admin Only) */}
                    {isSuperAdmin && u.role !== "super_admin" && (
                      <button
                        onClick={() => handleRoleToggle(u)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                          u.role === "admin"
                            ? "border-red-500/20 text-red-450 hover:bg-red-500/10"
                            : "border-green-500/20 text-green-400 hover:bg-green-500/10"
                        }`}
                      >
                        {u.role === "admin" ? "Destituer Admin" : "Promouvoir Admin"}
                      </button>
                    )}

                    {/* Official verification (Admin & Super Admin) */}
                    {u.isVerified ? (
                      <button
                        onClick={() => handleRemoveVerification(u)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/5 hover:border-red-500/20 hover:text-red-450 transition-all cursor-pointer text-neutral-450"
                      >
                        Retirer Certification
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenVerifyModal(u)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/5 hover:border-blue-500/20 hover:text-blue-400 transition-all cursor-pointer text-neutral-450"
                      >
                        Certifier Officiel
                      </button>
                    )}
                  </td>

                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500 italic">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Dialog Modal */}
      {verifyingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b0f]/80 backdrop-blur-sm p-4 animate-fadeIn">
          <form
            onSubmit={handleSaveVerification}
            className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5"
          >
            <div className="flex items-center space-x-2 text-blue-400">
              <HiCheckBadge className="text-2xl animate-pulse" />
              <h3 className="text-lg font-extrabold text-white font-display">Certification Officielle</h3>
            </div>

            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Vous allez certifier le profil de <span className="font-bold text-white">{verifyingUser.firstname} {verifyingUser.lastname}</span>.
              Indiquez sa fonction officielle (elle s&apos;affichera à côté de ses réponses aux pétitions).
            </p>

            <div>
              <label htmlFor="title" className="block mb-2 text-xs font-semibold text-neutral-350 pl-1">
                Titre Officiel
              </label>
              <Input
                type="text"
                id="title"
                placeholder="Ex: Maire de Douala 1er, Ministre de la Transition..."
                value={officialTitle}
                onChange={(e) => setOfficialTitle(e.target.value)}
                required
                disabled={actionLoading}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setVerifyingUser(null)}
                className="px-5 py-2.5 rounded-full border border-white/5 text-xs font-bold text-neutral-350 hover:text-white transition-colors cursor-pointer"
                disabled={actionLoading}
              >
                Annuler
              </button>
              <ButtonClick
                text={actionLoading ? "Enregistrement..." : "Confirmer la certification"}
                classButton="rounded-full bg-blue-500 hover:bg-blue-600 text-neutral-950 text-xs font-extrabold shadow-md"
                classArrow="hidden"
                type="submit"
                disabled={actionLoading || !officialTitle.trim()}
              />
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
