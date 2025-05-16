import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";

interface School {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
  school_id: string;
}

interface SchoolClassSelectorProps {
  onSelectionChange: (schoolId: string, classId: string) => void;
}

const SchoolClassSelector: React.FC<SchoolClassSelectorProps> = ({
  onSelectionChange,
}) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  );

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-get_schools",
        );

        if (error) throw error;
        if (data && data.schools) {
          setSchools(data.schools);
          if (data.schools.length > 0) {
            setSelectedSchool(data.schools[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching schools:", err);
        setError("Failed to load schools. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  // Fetch classes when selected school changes
  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedSchool) return;

      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-get_classes",
          {
            body: { school_id: selectedSchool },
          },
        );

        if (error) throw error;
        if (data && data.classes) {
          setClasses(data.classes);
          if (data.classes.length > 0) {
            setSelectedClass(data.classes[0].id);
            onSelectionChange(selectedSchool, data.classes[0].id);
          } else {
            setSelectedClass("");
            onSelectionChange(selectedSchool, "");
          }
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again.");
        setClasses([]);
        setSelectedClass("");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [selectedSchool]);

  // Notify parent component when selection changes
  useEffect(() => {
    if (selectedSchool && selectedClass) {
      onSelectionChange(selectedSchool, selectedClass);
    }
  }, [selectedClass]);

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
    setSelectedClass(""); // Reset class selection when school changes
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
  };

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <Select
              value={selectedSchool}
              onValueChange={handleSchoolChange}
              disabled={loading || schools.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/2">
            <Select
              value={selectedClass}
              onValueChange={handleClassChange}
              disabled={loading || classes.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default SchoolClassSelector;
