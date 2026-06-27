import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { CITIES, CITY_COORDS } from '../utils/distance';

const schema = yup.object().shape({
  name:     yup.string().required('Name is required').max(60, 'Maximum 60 characters'),
  email:    yup.string().email('Provide a valid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  phone:    yup.string().required('Phone number is required'),
  city:     yup.string().required('Please select a city'),
});

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedCity = watch('city');

  useEffect(() => {
    if (selectedCity && CITY_COORDS[selectedCity]) {
      const { lat, lng } = CITY_COORDS[selectedCity];
      setCoords({ lat, lng });
    }
  }, [selectedCity]);

  // Optionally fetch browser GPS
  const handleGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success('Accurate GPS coordinates saved.');
        },
        () => {
          toast.error('Could not fetch GPS. Defaulting to selected city.');
        }
      );
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    const postData = {
      ...formData,
      state: CITY_COORDS[formData.city]?.state || '',
      lat: coords.lat,
      lng: coords.lng,
    };

    try {
      await registerAuth(postData);
      toast.success('Registration successful. Welcome!');
      navigate('/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
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
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200"
          alt="Luxury fashion showroom"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-onyx/75 to-transparent"></div>
        <div className="absolute bottom-16 left-16 max-w-md z-10">
          <span className="font-sans text-[10px] tracking-widest uppercase text-champagne font-semibold block mb-3">
            FASTION Philosophy
          </span>
          <h2 className="font-serif text-4xl text-ivory font-light leading-tight mb-4">
            Curated Sustainable Luxury.
          </h2>
          <p className="font-sans text-xs text-ivory/80 leading-relaxed font-light">
            A wardrobe is a living history. Swap your pieces to create infinite expressions of identity.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <span className="font-sans text-xs tracking-widest uppercase text-champagne font-semibold">
            Registration
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-onyx font-medium mt-2 mb-6">
            Create Profile
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="input-luxury"
                placeholder="Jane Doe"
              />
              {errors.name && (
                <p className="text-[11px] text-burgundy font-medium mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className="input-luxury"
                placeholder="jane@domain.com"
              />
              {errors.email && (
                <p className="text-[11px] text-burgundy font-medium mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="input-luxury"
                placeholder="+91 XXXXX XXXXX"
              />
              {errors.phone && (
                <p className="text-[11px] text-burgundy font-medium mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-1">
                Select City
              </label>
              <select
                {...register('city')}
                className="input-luxury bg-transparent"
              >
                <option value="" className="text-onyx bg-ivory">-- Choose City --</option>
                {CITIES.map(city => (
                  <option key={city} value={city} className="text-onyx bg-ivory">
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-[11px] text-burgundy font-medium mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs py-2">
              <span className="text-warmgrey font-light">Want nearby items sorted automatically?</span>
              <button
                type="button"
                onClick={handleGPSLocation}
                className="text-[10px] tracking-wider uppercase text-champagne border border-champagne px-3 py-1.5 hover:bg-champagne hover:text-onyx transition-colors duration-300"
              >
                Use GPS
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-1">
                Create Password
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
                  'Curate Profile'
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-warmgrey font-light">
            Already have an account?{' '}
            <Link to="/login" className="text-champagne font-medium hover:text-champagne-dark transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
