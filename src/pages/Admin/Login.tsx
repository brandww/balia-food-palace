import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Lock, LogIn, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user is admin in Firestore
      // Note: The first admin is bootstrapped in rules, but we check here for UI redirection
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      // Default admin check (matches rules)
      const isDefaultAdmin = user.email === 'bktiwari879@gmail.com';
      
      if (isDefaultAdmin || (userData && userData.role === 'admin')) {
        toast.success('Welcome back, Admin!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Access denied. You are not an authorized admin.');
        await signOut(auth);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-medium">
        <ArrowLeft size={20} /> Back to Website
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 md:p-12 rounded-[3rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-orange-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-200 rotate-3">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-bold text-orange-950 mb-2">Admin Portal</h1>
          <p className="text-gray-500">Secure access for Ballia's Food Palace management.</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 flex items-start gap-4">
            <ShieldCheck className="text-orange-600 shrink-0 mt-1" size={24} />
            <p className="text-sm text-gray-600 leading-relaxed">
              This area is restricted to authorized personnel only. Please sign in with your registered admin account.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white text-gray-700 border-2 border-gray-100 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-orange-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-orange-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-orange-100 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Powered by Ballia's Food Palace
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
