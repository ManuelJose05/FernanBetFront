export interface User {
    id: number;
    email:      string;
    username:   string;
    first_name: string;
    last_name:  string;
    is_active:  boolean;
    level:      string[];
    experience: number;
    school_id:  number;
    course:     string;
    password:      string;
}