import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState, useEffect } from 'react';

interface ProfileData {
  first_name?: string;
  last_initial?: string;
  student_id?: string;
  year_program?: string;
  clubs_societies?: string[];
  hobbies?: string[];
  skills?: string[];
  study_groups?: string[];
  achievements?: string[];
  fun_bio?: string;
  linkedin_url?: string;
  github_url?: string;
  interest_tags?: string[];
  show_real_name?: boolean;
  show_contact_info?: boolean;
  show_location?: boolean;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
}

export default function EditProfileModal({ isOpen, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>({});
  const [activeTab, setActiveTab] = useState('identity');

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/profile/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Failed to load profile');
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${getAPIBaseURL()}/api/v1/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save profile');
    }
  };

  const updateArrayField = (field: keyof ProfileData, value: string) => {
    const current = (formData[field] as string[]) || [];
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: items });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab('identity')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'identity' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              Identity
            </button>
            <button
              onClick={() => setActiveTab('interests')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'interests' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              Interests
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'academic' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              Academic
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'social' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              Social
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'privacy' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              Privacy
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Initial</label>
                  <input
                    type="text"
                    maxLength={1}
                    value={formData.last_initial || ''}
                    onChange={(e) => setFormData({ ...formData, last_initial: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  type="text"
                  value={formData.student_id || ''}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year/Program</label>
                <input
                  type="text"
                  placeholder="e.g., Journalism, Year 2"
                  value={formData.year_program || ''}
                  onChange={(e) => setFormData({ ...formData, year_program: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clubs & Societies</label>
                <input
                  type="text"
                  placeholder="AI Club, Drama Society (comma separated)"
                  value={(formData.clubs_societies || []).join(', ')}
                  onChange={(e) => updateArrayField('clubs_societies', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
                <input
                  type="text"
                  placeholder="Photography, Coding, Football (comma separated)"
                  value={(formData.hobbies || []).join(', ')}
                  onChange={(e) => updateArrayField('hobbies', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <input
                  type="text"
                  placeholder="Python, Public Speaking (comma separated)"
                  value={(formData.skills || []).join(', ')}
                  onChange={(e) => updateArrayField('skills', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Study Groups</label>
                <input
                  type="text"
                  placeholder="Math Study Group (comma separated)"
                  value={(formData.study_groups || []).join(', ')}
                  onChange={(e) => updateArrayField('study_groups', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                <input
                  type="text"
                  placeholder="Debate Champion 2023 (comma separated)"
                  value={(formData.achievements || []).join(', ')}
                  onChange={(e) => updateArrayField('achievements', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fun Bio</label>
                <textarea
                  placeholder="Coffee + Code = Life"
                  value={formData.fun_bio || ''}
                  onChange={(e) => setFormData({ ...formData, fun_bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url || ''}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Tags</label>
                <input
                  type="text"
                  placeholder="#StartupLover, #Bookworm (comma separated)"
                  value={(formData.interest_tags || []).join(', ')}
                  onChange={(e) => updateArrayField('interest_tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Show Real Name</span>
                <input
                  type="checkbox"
                  checked={formData.show_real_name || false}
                  onChange={(e) => setFormData({ ...formData, show_real_name: e.target.checked })}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Show Contact Info</span>
                <input
                  type="checkbox"
                  checked={formData.show_contact_info || false}
                  onChange={(e) => setFormData({ ...formData, show_contact_info: e.target.checked })}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Show Location</span>
                <input
                  type="checkbox"
                  checked={formData.show_location || false}
                  onChange={(e) => setFormData({ ...formData, show_location: e.target.checked })}
                  className="rounded"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}