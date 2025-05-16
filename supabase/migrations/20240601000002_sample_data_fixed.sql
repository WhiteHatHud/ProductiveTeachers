-- Insert sample schools
INSERT INTO schools (id, name) VALUES 
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Springfield Elementary'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Riverdale High');

-- Insert sample classes
INSERT INTO classes (id, name, school_id) VALUES 
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Grade 1A', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'Grade 2B', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('d290f1ee-6c54-4b01-90e6-d701748f0855', 'Class 10A', 'd290f1ee-6c54-4b01-90e6-d701748f0852'),
('d290f1ee-6c54-4b01-90e6-d701748f0856', 'Class 11B', 'd290f1ee-6c54-4b01-90e6-d701748f0852');

-- Insert sample teachers
INSERT INTO teachers (id, name, school_id, class_id) VALUES 
('d290f1ee-6c54-4b01-90e6-d701748f0857', 'Ms. Krabappel', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0853'),
('d290f1ee-6c54-4b01-90e6-d701748f0858', 'Mr. Bergstrom', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0854'),
('d290f1ee-6c54-4b01-90e6-d701748f0859', 'Ms. Grundy', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0855'),
('d290f1ee-6c54-4b01-90e6-d701748f0860', 'Mr. Weatherbee', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0856');

-- Insert sample students
INSERT INTO students (id, name, school_id, class_id) VALUES 
('d290f1ee-6c54-4b01-90e6-d701748f0861', 'Bart Simpson', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0853'),
('d290f1ee-6c54-4b01-90e6-d701748f0862', 'Lisa Simpson', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0853'),
('d290f1ee-6c54-4b01-90e6-d701748f0863', 'Milhouse Van Houten', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0853'),
('d290f1ee-6c54-4b01-90e6-d701748f0864', 'Ralph Wiggum', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0854'),
('d290f1ee-6c54-4b01-90e6-d701748f0865', 'Martin Prince', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0854'),
('d290f1ee-6c54-4b01-90e6-d701748f0866', 'Archie Andrews', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0855'),
('d290f1ee-6c54-4b01-90e6-d701748f0867', 'Betty Cooper', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0855'),
('d290f1ee-6c54-4b01-90e6-d701748f0868', 'Veronica Lodge', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0855'),
('d290f1ee-6c54-4b01-90e6-d701748f0869', 'Jughead Jones', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0856'),
('d290f1ee-6c54-4b01-90e6-d701748f0870', 'Reggie Mantle', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0856');

-- Insert sample attendance records for the past week
INSERT INTO attendance (student_id, date, status) VALUES 
-- Springfield Elementary - Grade 1A - Yesterday
('d290f1ee-6c54-4b01-90e6-d701748f0861', CURRENT_DATE - INTERVAL '1 day', 'present'),
('d290f1ee-6c54-4b01-90e6-d701748f0862', CURRENT_DATE - INTERVAL '1 day', 'present'),
('d290f1ee-6c54-4b01-90e6-d701748f0863', CURRENT_DATE - INTERVAL '1 day', 'absent'),

-- Springfield Elementary - Grade 1A - 2 days ago
('d290f1ee-6c54-4b01-90e6-d701748f0861', CURRENT_DATE - INTERVAL '2 day', 'present'),
('d290f1ee-6c54-4b01-90e6-d701748f0862', CURRENT_DATE - INTERVAL '2 day', 'late'),
('d290f1ee-6c54-4b01-90e6-d701748f0863', CURRENT_DATE - INTERVAL '2 day', 'absent'),

-- Springfield Elementary - Grade 1A - 3 days ago
('d290f1ee-6c54-4b01-90e6-d701748f0861', CURRENT_DATE - INTERVAL '3 day', 'absent'),
('d290f1ee-6c54-4b01-90e6-d701748f0862', CURRENT_DATE - INTERVAL '3 day', 'present'),
('d290f1ee-6c54-4b01-90e6-d701748f0863', CURRENT_DATE - INTERVAL '3 day', 'absent'),

-- Springfield Elementary - Grade 2B - Yesterday
('d290f1ee-6c54-4b01-90e6-d701748f0864', CURRENT_DATE - INTERVAL '1 day', 'present'),
('d290f1ee-6c54-4b01-90e6-d701748f0865', CURRENT_DATE - INTERVAL '1 day', 'present'),

-- Springfield Elementary - Grade 2B - 2 days ago
('d290f1ee-6c54-4b01-90e6-d701748f0864', CURRENT_DATE - INTERVAL '2 day', 'absent'),
('d290f1ee-6c54-4b01-90e6-d701748f0865', CURRENT_DATE - INTERVAL '2 day', 'present'),

-- Riverdale High - Class 10A - Yesterday
('d290f1ee-6c54-4b01-90e6-d701748f0866', CURRENT_DATE - INTERVAL '1 day', 'present'),
('d290f1ee-6c54-4b01-90e6-d701748f0867', CURRENT_DATE - INTERVAL '1 day', 'late'),
('d290f1ee-6c54-4b01-90e6-d701748f0868', CURRENT_DATE - INTERVAL '1 day', 'absent'),

-- Riverdale High - Class 11B - Yesterday
('d290f1ee-6c54-4b01-90e6-d701748f0869', CURRENT_DATE - INTERVAL '1 day', 'present'),
('d290f1ee-6c54-4b01-90e6-d701748f0870', CURRENT_DATE - INTERVAL '1 day', 'present');

-- Insert sample admins
INSERT INTO admins (id, name, email, school_id) VALUES 
('d290f1ee-6c54-4b01-90e6-d701748f0871', 'Principal Skinner', 'skinner@springfield.edu', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('d290f1ee-6c54-4b01-90e6-d701748f0872', 'Principal Weatherbee', 'principal@riverdale.edu', 'd290f1ee-6c54-4b01-90e6-d701748f0852');