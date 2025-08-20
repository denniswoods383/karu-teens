import { useState, useEffect } from 'react';
import Link from 'next/link';

const FirstYearsPage = () => {
  const [units, setUnits] = useState<string[]>([]);

  useEffect(() => {
    const firstYearUnits = [
      'ACS 111', 'AEE 100', 'AEE 112', 'AFM 120', 'AFM 121', 'AFM 122', 'AGR 100', 'AGR 102',
      'AHP 111', 'AHP 112', 'AHP 113', 'AHP 114', 'AHP 115', 'AHP 116', 'ANS 111', 'BAS 101',
      'BAS 102', 'BBM 100', 'BBM 101', 'BBM 104', 'BBM 105', 'BGS 110', 'BGS 111', 'BHM 101',
      'BHM 103', 'BHR 112', 'BHR 113', 'BHR 114', 'BHS 112', 'BIT 110', 'BIT 111', 'BLL 110',
      'BOT 112', 'BTM 101', 'BTM 102', 'BTM 103', 'BTM 104', 'BTM 105', 'CCM 100', 'CCM 101',
      'CCM 102', 'CCM 103', 'CCP 101', 'CCP 102', 'CCP 103', 'CHE 112', 'CHE 114', 'CHE 120',
      'CHE 126', 'CL 111', 'CLM 110', 'CLM 111', 'CLM 112', 'CLM 113', 'CLM 114', 'CLM 115',
      'CMD 110', 'CMD 111', 'COM 112', 'COM 114', 'ECO 110', 'ECO 112', 'EDF 110', 'EGC 101',
      'EGC 102', 'ENG 110', 'ENG 111', 'FRE 100', 'FRE 101E', 'GEO 110', 'GEO 112', 'HIS 110',
      'HIS 111', 'KIS 110', 'KIS 111', 'KIS 112', 'LIT 110', 'LIT 111', 'LMC 111', 'MAT 100',
      'MAT 115', 'MAT 116', 'MAT 122', 'MLS 110', 'MLS 111', 'MLS 112', 'MLS 113', 'MLS 114',
      'MLS 115', 'MLS 116', 'NHS 110', 'NHS 111', 'NHS 112', 'NHS 113', 'NHS 114', 'PHY 112',
      'PHY 113', 'PHY 115', 'PHY 116', 'PPM 111', 'PPM 112', 'PSA 110', 'PSA 111', 'PTR 110',
      'REL 110', 'REL 111', 'SNE 100', 'SNE 110', 'SOC 110', 'STA 111', 'STA 116', 'UCC 100',
      'UCC 101', 'ZOO 112', 'ZOO 113', 'ZOO 121'
    ];
    setUnits(firstYearUnits);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">First Year Units</h1>
            <Link href="/mwaks">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Back to Years
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {units.map((unit) => (
              <Link key={unit} href={`/mwaks/units/${unit.replace(' ', '-')}`}>
                <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg hover:from-green-500 hover:to-blue-600 transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <h3 className="font-semibold text-center">{unit}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstYearsPage;