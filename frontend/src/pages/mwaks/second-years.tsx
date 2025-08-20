import { useState, useEffect } from 'react';
import Link from 'next/link';

const SecondYearsPage = () => {
  const [units, setUnits] = useState<string[]>([]);

  useEffect(() => {
    const secondYearUnits = [
      'ACS 211', 'ACS 212', 'AEE 210', 'AEE 212', 'AEE 215', 'AEE 290', 'AGE 237', 'AGR 281',
      'AGR 293', 'AHP 211', 'AHP 212', 'AHP 213', 'AHP 214', 'AHP 215', 'AHP 216', 'AHP 290',
      'ANS 223', 'BAS 201', 'BAS 202', 'BBM 200', 'BBM 201', 'BBM 202', 'BBM 203', 'BBM 204',
      'BBM 205', 'BBM 211', 'BGS 204', 'BGS 205', 'BHM 201', 'BHM 202', 'BHM 203', 'BHM 204',
      'BHR 213', 'BHR 214', 'BHR 215', 'BHR 216', 'BHR 217', 'BHS 210', 'BHS 211', 'BHS 212',
      'BHS 213', 'BHS 214', 'BIT 211', 'BIT 216', 'BKS 210', 'BOT 210', 'BOT 213', 'BTM 201',
      'BTM 202', 'BTM 203', 'BTM 204', 'BTM 205', 'CCM 200', 'CCM 201', 'CCM 202', 'CCM 203',
      'CCM 204', 'CCP 201', 'CCP 202', 'CCP 203', 'CHE 210', 'CHE 211', 'CHE 217', 'CIM 210',
      'CMD 210', 'CMD 211', 'CMD 213', 'COM 210', 'COM 211', 'COM 213', 'COM 216', 'ECO 210',
      'ECO 211', 'ECO 212', 'ECO 214', 'EDF 210', 'EGC 201', 'EGC 202', 'ENG 210', 'ENG 211',
      'ENS 210', 'ENS 211', 'ENS 212', 'ENS 214', 'FRE 201E', 'FSN 215', 'GEO 201', 'GEO 204',
      'GEO 205', 'GEO 210', 'GEO 211', 'GEO 212', 'HIS 201', 'HIS 210', 'HIS 211', 'HND 210',
      'HND 211', 'HND 218', 'HND 219', 'KIS 210', 'KIS 211', 'LIN 210', 'LIT 210', 'LIT 211',
      'LTF 210', 'MAT 213', 'MAT 214', 'NHS 210', 'NHS 211', 'NHS 212', 'NHS 213', 'NHS 214',
      'NHS 215', 'NRS 211', 'PHY 211', 'PHY 215', 'PPM 211', 'PPM 212', 'PPM 213', 'PPM 214',
      'PRT 210', 'PSA 211', 'PSA 212', 'PSA 215', 'PSA 216', 'PSY 210', 'REL 211', 'SNE 200',
      'SNE 201', 'SOC 202', 'SOC 210', 'SOC 211', 'STA 221', 'STA 222', 'STA 225', 'UCC 200',
      'UCC 201', 'ZOO 212', 'ZOO 213'
    ];
    setUnits(secondYearUnits);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Second Year Units</h1>
            <Link href="/mwaks">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Back to Years
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {units.map((unit) => (
              <Link key={unit} href={`/mwaks/units/${unit.replace(' ', '-')}`}>
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all duration-300 cursor-pointer transform hover:scale-105">
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

export default SecondYearsPage;