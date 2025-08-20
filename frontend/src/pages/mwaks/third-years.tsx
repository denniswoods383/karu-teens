import { useState, useEffect } from 'react';
import Link from 'next/link';

const ThirdYearsPage = () => {
  const [units, setUnits] = useState<string[]>([]);

  useEffect(() => {
    const thirdYearUnits = [
      'ABE 383', 'ACS 311', 'ACS 312', 'ACS 313', 'AEE 315', 'AFM 310', 'AFM 311', 'AFM 312',
      'AFM 313', 'AFM 314', 'AFM 315', 'AGR 300', 'AGR 326', 'AGR 336', 'AGR 343', 'AHP 311',
      'AHP 312', 'AHP 313', 'AHP 314', 'AHP 315', 'AHP 316', 'ARE 351', 'BAS 301', 'BAS 302',
      'BAS 303', 'BBM 300', 'BBM 302', 'BBM 304', 'BBM 310', 'BBM 311', 'BBM 312', 'BBM 313',
      'BBM 350', 'BBM 360', 'BBM 375', 'BGS 302', 'BHM 301', 'BHM 302', 'BHM 303', 'BHM 304',
      'BHM 305', 'BHR 313', 'BHR 314', 'BHR 315', 'BHR 316', 'BHR 317', 'BHR 318', 'BHS 310',
      'BHS 311', 'BHS 312', 'BHS 313', 'BHS 314', 'BHS 315', 'BHS 316', 'BIO 321', 'BIO 322',
      'BIO 323', 'BIO 324', 'BIO 325', 'BIO 326', 'BIT 314', 'BIT 316', 'BIT 317', 'BIT 318',
      'BIT 319', 'BIT 342E', 'BOT 310', 'BOT 315', 'BTM 302', 'BTM 303', 'BTM 305', 'CCM 300',
      'CCM 301', 'CCM 302', 'CCM 303', 'CCM 304', 'CCM 305', 'CCP 301', 'CCP 303', 'CCP 304',
      'CHE 310', 'CHE 313', 'CHE 314', 'CHE 323', 'CIM 311', 'CIM 312', 'CIM 313', 'CIM 314',
      'CIM 315', 'CIM 316', 'CIM 317', 'CIM 318', 'CIM 321', 'CIM 322', 'CIM 323', 'CIM 324',
      'CIM 325', 'CMD 309', 'CMD 310', 'CMD 311', 'COM 310', 'COM 312E', 'COM 314', 'COM 316',
      'COM 332', 'EBH 310', 'EBH 310E', 'ECO 310', 'ECO 312', 'ECO 314', 'ECO 317', 'ECO 318',
      'EGC 301', 'EGC 302', 'EGC 305', 'ENG 310', 'ENG 311', 'ENG 312', 'FRE 301E', 'GEO 310',
      'GEO 311', 'GEO 312', 'GEO 314', 'GEO 315', 'HIS 310', 'HIS 311', 'INS 310', 'INS 311',
      'INS 312', 'INS 313', 'INS 314', 'INS 341', 'KIS 310', 'KIS 311', 'KIS 312', 'LIT 310',
      'LIT 311', 'LIT 311A', 'MAT 301', 'MAT 310', 'MAT 312', 'MAT 313', 'MAT 317', 'MIC 310',
      'MIC 311', 'MIC 312', 'NHS 310', 'NHS 311', 'NHS 312', 'NHS 313', 'NHS 315', 'NHS 316',
      'NRS 381E', 'OO 322', 'PHY 309', 'PHY 310', 'PHY 311', 'PPM 311', 'PPM 312', 'PPM 313',
      'PPM 314', 'PPM 315', 'PPM 316', 'PPM 317', 'PRT 310', 'PSA 311', 'PSA 313', 'PSA 315',
      'PSY 310', 'REL 310', 'SNE 300', 'SNE 301', 'SOC 310', 'SOC 311', 'SOC 314', 'SOC 321',
      'STA 300', 'STA 313', 'STA 316', 'STA 317', 'STA 319', 'UCC 300', 'ZOO 309'
    ];
    setUnits(thirdYearUnits);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Third Year Units</h1>
            <Link href="/mwaks">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Back to Years
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {units.map((unit) => (
              <Link key={unit} href={`/mwaks/units/${unit.replace(' ', '-')}`}>
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 rounded-lg hover:from-orange-500 hover:to-red-600 transition-all duration-300 cursor-pointer transform hover:scale-105">
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

export default ThirdYearsPage;