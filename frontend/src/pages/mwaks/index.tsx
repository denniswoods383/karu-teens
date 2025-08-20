import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const MwaksPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      setUser(user);
    };
    getUser();
  }, []);

  const years = [
    { name: 'First Years', path: '/mwaks/first-years' },
    { name: 'Second Years', path: '/mwaks/second-years' },
    { name: 'Third Years', path: '/mwaks/third-years' },
    { name: 'Fourth Years', path: '/mwaks/fourth-years' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            MWAKS - Academic Resources
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {years.map((year) => (
              <Link key={year.path} href={year.path}>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <h2 className="text-xl font-semibold text-center">{year.name}</h2>
                  <p className="text-center mt-2 opacity-90">Access course materials and resources</p>
                </div>
              </Link>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
};

export default MwaksPage;