export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

export interface Role {
  id: string;
  name: string;
  type: string;
  dateCreated: string;
  status: 'Active' | 'Inactive' | 'Pending';
  teamMembers: TeamMember[];
}

export interface RolesResponse {
  success: boolean;
  data: Role[];
  total: number;
}
