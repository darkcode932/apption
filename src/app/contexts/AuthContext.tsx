"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../../domain/entities/User";
import { authRepository } from "../../infrastructure/ServiceLocator";
import { geolocationService } from "../../infrastructure/geolocation/geolocationService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes using our clean architecture repo
    const unsubscribe = authRepository.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        try {
          // Auto-resolve location if not already defined on the user profile
          if (!firebaseUser.latitude || !firebaseUser.longitude || !firebaseUser.city || !firebaseUser.country) {
            const loc = await geolocationService.getCurrentLocation();
            
            // Update Firestore document
            await authRepository.updateUserProfile(firebaseUser.id, {
              latitude: loc.latitude,
              longitude: loc.longitude,
              city: loc.city,
              country: loc.country,
              location: firebaseUser.location || `${loc.city}, ${loc.country}`,
            });

            // Sync with local context state
            setUser((prev) =>
              prev && prev.id === firebaseUser.id
                ? {
                    ...prev,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    city: loc.city,
                    country: loc.country,
                    location: prev.location || `${loc.city}, ${loc.country}`,
                  }
                : prev
            );
          }
        } catch (locErr) {
          console.warn("Could not automatically update user location profile:", locErr);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
