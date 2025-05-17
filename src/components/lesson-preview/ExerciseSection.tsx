
import React from 'react';

export interface ExerciseItem {
  name: string;
  description: string | null;
  time: number;
  phase?: string | null;
}

interface ExerciseSectionProps {
  title: string;
  duration: number;
  role: string;
  exercises: ExerciseItem[];
}

const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  title,
  duration,
  role,
  exercises
}) => {
  return (
    <div className="p-6 border-b">
      <h3 className="text-xl font-bold mb-4">{title} ({duration} minut) - {role}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Název cviku</th>
            <th className="border p-2 text-left">Popis</th>
            <th className="border p-2 text-center">Čas (min)</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise, index) => (
            <tr key={`${title.toLowerCase()}-${index}`}>
              <td className="border p-2">{exercise.name}</td>
              <td className="border p-2">{exercise.description}</td>
              <td className="border p-2 text-center">{exercise.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExerciseSection;
