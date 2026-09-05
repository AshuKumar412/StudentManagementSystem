import { useState, useEffect, useRef } from 'react';
import { studentsService } from '../../services/studentsService';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { CameraIcon, TrashIcon, UserIcon, MailIcon, PhoneIcon, AcademicCapIcon, BuildingOfficeIcon } from '../../components/common/Icons';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);

  const fetchProfile = () => {
    if (user?.email) {
      studentsService.getAll({ search: user.email })
        .then(r => {
          const list = r.data?.data?.content || [];
          if (list.length > 0) {
            setProfile(list[0]);
          }
        })
        .catch(() => toast.error('Failed to load profile details'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    setUploading(true);
    try {
      const res = await studentsService.uploadImage(file);
      const imageUrl = res.data?.data?.imageUrl;

      await studentsService.update(profile.id, {
        ...profile,
        profilePicture: imageUrl
      });

      setProfile(p => ({ ...p, profilePicture: imageUrl }));
      toast.success('Profile photo updated successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to update photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile) return;
    if (!confirm('Remove profile photo?')) return;
    setUploading(true);
    try {
      await studentsService.update(profile.id, {
        ...profile,
        profilePicture: null
      });
      setProfile(p => ({ ...p, profilePicture: null }));
      toast.success('Photo removed');
    } catch (err) {
      toast.error('Failed to remove photo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : (user?.name || 'Student');

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Header Card */}
      <div className="card p-0 overflow-hidden border border-[var(--border)] shadow-sm">
        {/* Banner with pattern */}
        <div className="h-44 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-white tracking-wide border border-white/20">
              Verified Student
            </span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative group">
                {profile?.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={fullName}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-[var(--surface)] shadow-xl bg-[var(--surface)] ring-2 ring-indigo-500/20"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-4xl font-bold border-4 border-[var(--surface)] shadow-xl ring-2 ring-indigo-500/20">
                    {profile?.firstName ? profile.firstName[0] : (user?.name?.[0] || 'S')}
                  </div>
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
                    Updating...
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all border-2 border-[var(--surface)] cursor-pointer"
                  title="Upload profile picture"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                    {fullName}
                  </h1>
                  <StatusBadge status={profile?.status || 'ACTIVE'} type="enrollment" />
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-[var(--text-secondary)]">
                  <span className="font-mono bg-[var(--surface-muted)] px-2.5 py-0.5 rounded-md font-semibold text-indigo-600 dark:text-indigo-400 border border-[var(--border)]">
                    ID: {profile?.studentId || 'STU-PROVISIONAL'}
                  </span>
                  <span>•</span>
                  <span>{profile?.departmentName || 'General Studies'}</span>
                  <span>•</span>
                  <span>{profile?.semester ? `Semester ${profile.semester}` : 'Semester 1'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-center sm:justify-end gap-2">
              {profile?.profilePicture && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                  className="btn-ghost text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  Remove Photo
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[var(--border)] gap-6 mt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              General Overview
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'academic'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Academic Records
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'contact'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Contact & Address
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-[var(--surface-muted)] p-5 rounded-xl border border-[var(--border)]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-indigo-500" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">First Name</span>
                      <span className="font-semibold text-[var(--text-primary)]">{profile?.firstName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Last Name</span>
                      <span className="font-semibold text-[var(--text-primary)]">{profile?.lastName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Gender</span>
                      <span className="font-semibold text-[var(--text-primary)]">{profile?.gender || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Date of Birth</span>
                      <span className="font-semibold text-[var(--text-primary)]">{profile?.dateOfBirth || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-[var(--surface-muted)] p-5 rounded-xl border border-[var(--border)]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4 text-indigo-500" />
                    Enrollment Status
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Student Status</span>
                      <div className="mt-1">
                        <StatusBadge status={profile?.status || 'ACTIVE'} type="enrollment" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Current Term</span>
                      <span className="font-semibold text-[var(--text-primary)]">Semester {profile?.semester || 1}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Primary Department</span>
                      <span className="font-semibold text-[var(--text-primary)]">{profile?.departmentName || 'General Studies'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">System Roll ID</span>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{profile?.studentId || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="bg-[var(--surface-muted)] p-5 rounded-xl border border-[var(--border)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <BuildingOfficeIcon className="w-4 h-4 text-indigo-500" />
                  Department & Curriculum Standing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                    <span className="text-xs text-[var(--text-muted)] block">Department</span>
                    <span className="font-bold text-[var(--text-primary)] mt-1 block">{profile?.departmentName || 'General Studies'}</span>
                  </div>
                  <div className="p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                    <span className="text-xs text-[var(--text-muted)] block">Academic Term</span>
                    <span className="font-bold text-[var(--text-primary)] mt-1 block">Semester {profile?.semester || 1}</span>
                  </div>
                  <div className="p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                    <span className="text-xs text-[var(--text-muted)] block">Registration Type</span>
                    <span className="font-bold text-[var(--text-primary)] mt-1 block">Undergraduate Regular</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Academic grades, marks, and attendance details are accessible via the respective navigation tabs in the student portal sidebar.
                </p>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-[var(--surface-muted)] p-5 rounded-xl border border-[var(--border)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <MailIcon className="w-4 h-4 text-indigo-500" />
                  Communication Channels & Physical Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3 p-3.5 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 shrink-0">
                      <MailIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Institutional Email</span>
                      <span className="font-medium text-[var(--text-primary)]">{profile?.email || user?.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 shrink-0">
                      <PhoneIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Phone Number</span>
                      <span className="font-medium text-[var(--text-primary)]">{profile?.phone || 'Not on file'}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                    <span className="text-xs text-[var(--text-muted)] block">Residential / Permanent Address</span>
                    <span className="font-medium text-[var(--text-primary)] mt-1 block">{profile?.address || 'No registered address on file.'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}