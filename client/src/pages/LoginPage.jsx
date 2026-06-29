import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const schema = yup.object().shape({
  email: yup.string().email('Provide a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back to FASTION');
      navigate('/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[85vh] grid grid-cols-1 md:grid-cols-2 bg-ivory"
    >
      {/* Editorial side panel */}
      <div className="hidden md:block relative bg-onyx overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200"
          alt="Quiet Luxury editorial"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-onyx/75 to-transparent"></div>
        <div className="absolute bottom-16 left-16 max-w-md z-10">
          <span className="font-sans text-[10px] tracking-widest uppercase text-champagne font-semibold block mb-3">
            FASTION Barter System
          </span>
          <h2 className="font-serif text-4xl text-ivory font-light leading-tight mb-4">
            Curate, Connect, Exchange.
          </h2>
          <p className="font-sans text-xs text-ivory/80 leading-relaxed font-light">
            Welcome to the sustainable sanctuary where style transcends currency.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-md">
          <span className="font-sans text-xs tracking-widest uppercase text-champagne font-semibold">
            Member Access
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-onyx font-medium mt-2 mb-8">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className="input-luxury"
                placeholder="name@domain.com"
              />
              {errors.email && (
                <p className="text-[11px] text-burgundy font-medium mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="input-luxury"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-[11px] text-burgundy font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center items-center"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ivory border-t-transparent"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-warmgrey font-light">
            Not a member yet?{' '}
            <Link to="/register" className="text-champagne font-medium hover:text-champagne-dark transition-colors">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
