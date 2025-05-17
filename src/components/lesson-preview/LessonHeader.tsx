
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LessonHeaderProps {
  school: string;
  construct: string;
  environment: string;
  equipmentNames: string[];
  totalTime: number;
  preparationTime: number;
  mainTime: number;
  finishTime: number;
  preparationRole: string;
  mainRole: string;
  finishRole: string;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  school,
  construct,
  environment,
  equipmentNames,
  totalTime,
  preparationTime,
  mainTime,
  finishTime,
  preparationRole,
  mainRole,
  finishRole
}) => {
  return (
    <Card className="shadow-md mb-6 overflow-hidden">
      <CardHeader className="bg-primary text-white">
        <CardTitle className="text-center text-2xl">Plán hodiny tělesné výchovy</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 border-b">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold pr-4">Škola:</td>
                <td>{school || 'Neurčeno'}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Název hodiny:</td>
                <td>Tělesná výchova - {construct}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Prostředí:</td>
                <td>{environment || 'Neurčeno'}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Vybavení:</td>
                <td>{equipmentNames.length > 0 ? equipmentNames.join(', ') : 'Žádné'}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Cvičební konstrukt:</td>
                <td>{construct || 'Neurčeno'}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Časová dotace:</td>
                <td>{totalTime} minut (Přípravná: {preparationTime}, Hlavní: {mainTime}, Závěrečná: {finishTime})</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Vedení hodiny:</td>
                <td>
                  Přípravná část: {preparationRole || 'Neurčeno'}, 
                  Hlavní část: {mainRole || 'Neurčeno'}, 
                  Závěrečná část: {finishRole || 'Neurčeno'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonHeader;
