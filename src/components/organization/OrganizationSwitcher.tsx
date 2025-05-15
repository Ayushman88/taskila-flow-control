
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, Organization } from "@/context/AuthContext";

interface OrganizationSwitcherProps {
  currentOrganization: Organization | null;
  organizations: Organization[];
}

const OrganizationSwitcher: React.FC<OrganizationSwitcherProps> = ({
  currentOrganization,
  organizations
}) => {
  const { setCurrentOrganization } = useAuth();

  if (!organizations || organizations.length <= 1) {
    return null;
  }

  const handleSwitchOrganization = async (orgId: string) => {
    await setCurrentOrganization(orgId);
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          {currentOrganization?.name || "Switch Organization"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {organizations.map(org => (
          <DropdownMenuItem 
            key={org.id}
            className={currentOrganization?.id === org.id ? "bg-slate-100" : ""}
            onClick={() => handleSwitchOrganization(org.id)}
          >
            {org.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
