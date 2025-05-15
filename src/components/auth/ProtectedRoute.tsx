
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, organizations, loadUserOrganizations } = useAuth();
  const location = useLocation();
  const [orgsLoaded, setOrgsLoaded] = React.useState(false);

  useEffect(() => {
    if (user && !orgsLoaded) {
      loadUserOrganizations().then(() => {
        setOrgsLoaded(true);
      });
    }
  }, [user, orgsLoaded]);

  if (isLoading) {
    // Loading spinner
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to signin page if not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check if current page is dashboard-related but not organization creation
  const isDashboardPage = !location.pathname.includes('/create-organization') && 
                          !location.pathname.includes('/join-organization') &&
                          location.pathname !== '/signin' && 
                          location.pathname !== '/signup' &&
                          location.pathname !== '/';

  // If it's a dashboard page and we've loaded orgs, check if user has an organization
  if (isDashboardPage && orgsLoaded && (!organizations || organizations.length === 0)) {
    // If no organization, redirect to create organization
    return <Navigate to="/create-organization" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
