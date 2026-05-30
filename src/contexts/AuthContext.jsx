import { baseUrl } from "../lib/url";
import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
 const checkAuth = async () => {
  try{
   
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    }); 

    if (!res.ok) {
      
      setUser(null)
      return;
    }
    const data = await res.json();
    setUser(data.data);
  
  }catch(e){
    console.error('[Auth] Authentication check failed', { error: e instanceof Error ? e.message : e })
    setUser(null)
  }finally{() => setLoading(false)};
}
  useEffect(() => {
    checkAuth();
  }, [])

  return (<AuthContext.Provider value={{ user, loading, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  )

}
  export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }


  return context;
}