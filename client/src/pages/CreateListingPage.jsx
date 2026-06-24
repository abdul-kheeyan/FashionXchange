import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CATEGORIES, SIZES, CONDITIONS, BRANDS, calculateValue, formatValue } from '../utils/valueCalculator';
import { useAuth } from '../context/AuthContext';

const schema = yup.object().shape({
  title:       yup.string().required('Title is required').max(120),
  description: yup.string().required('Description is required').max(1000),
  category:    yup.string().required('Category is required'),
  brand:       yup.string().required('Brand is required'),
  size:        yup.string().required('Size is required'),
  condition:   yup.string().required('Condition is required'),
  city:        yup.string().required('City location is required'),
});

const CreateListingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [valueEstimate, setValueEstimate] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      city: user?.location?.city || '',
    }
  });

  const watchCategory  = watch('category');
  const watchBrand     = watch('brand');
  const watchCondition = watch('condition');

  // Memoize object URLs to prevent recreating them on every render
  const imageUrls = useMemo(() => {
    return imageFiles.map(file => URL.createObjectURL(file));
  }, [imageFiles]);

  // Cleanup object URLs on unmount or when files change
  useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  useEffect(() => {
    if (watchCategory && watchBrand && watchCondition) {
      const estimate = calculateValue(watchCategory, watchBrand, watchCondition);
      setValueEstimate(estimate);
    }
  }, [watchCategory, watchBrand, watchCondition]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.error('You can upload up to 5 images max.');
      return;
    }
    setImageFiles([...imageFiles, ...files]);
  };

  const removeSelectedImage = (index) => {
    setImageFiles(imageFiles.filter((_, idx) => idx !== index));
  };

  const onSubmit = async (formData) => {
    if (imageFiles.length === 0) {
      toast.error('Please upload at least one image.');
      return;
    }

    setLoading(true);
    const postData = new FormData();
    Object.keys(formData).forEach(key => {
      postData.append(key, formData[key]);
    });
    postData.append('estimatedValue', valueEstimate.toString());
    
    // Add location lat/lng based on user coordinates if present
    if (user?.location?.lat && user?.location?.lng) {
      postData.append('lat', user.location.lat.toString());
      postData.append('lng', user.location.lng.toString());
    }

    imageFiles.forEach(file => {
      postData.append('images', file);
    });

    try {
      await api.post('/listings', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Wardrobe listing published!');
      navigate('/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="section-pad max-w-3xl mx-auto"
    >
      <div className="mb-8 border-b border-hairline pb-6">
        <span className="font-sans text-xs tracking-widest uppercase text-champagne font-semibold">
          Wardrobe Curation
        </span>
        <h2 className="font-serif text-4xl text-onyx mt-2">
          List New Item
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
            Upload Images (1 to 5)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-warmgrey border border-hairline bg-white rounded-sm cursor-pointer transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:bg-onyx file:text-ivory file:border-0 file:rounded-sm file:text-xs file:font-medium file:uppercase file:tracking-wider file:cursor-pointer file:hover:bg-champagne file:hover:text-onyx file:transition-all file:duration-300"
          />
          {imageFiles.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {imageFiles.map((file, idx) => (
                <div key={idx} className="relative aspect-square border border-hairline bg-white">
                  <img
                    src={imageUrls[idx]}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeSelectedImage(idx)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center text-xs font-bold shadow-md"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
              Item Title
            </label>
            <input
              type="text"
              {...register('title')}
              className="input-box"
              placeholder="Zara Linen Summer Jacket"
            />
            {errors.title && <p className="text-[11px] text-burgundy font-medium mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
              Brand
            </label>
            <select {...register('brand')} className="input-box bg-transparent">
              <option value="">-- Select Brand Tier --</option>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {errors.brand && <p className="text-[11px] text-burgundy font-medium mt-1">{errors.brand.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
              Category
            </label>
            <select {...register('category')} className="input-box bg-transparent">
              <option value="">-- Category --</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-[11px] text-burgundy font-medium mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
              Size
            </label>
            <select {...register('size')} className="input-box bg-transparent">
              <option value="">-- Size --</option>
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.size && <p className="text-[11px] text-burgundy font-medium mt-1">{errors.size.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
              Condition
            </label>
            <select {...register('condition')} className="input-box bg-transparent">
              <option value="">-- Condition --</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.condition && <p className="text-[11px] text-burgundy font-medium mt-1">{errors.condition.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
              Exchange Valuation (Suggested)
            </label>
            <div className="input-box bg-hairline/30 text-champagne-dark font-medium border-dashed">
              {valueEstimate > 0 ? formatValue(valueEstimate) : 'Auto-Calculated After Specs'}
            </div>
            <p className="text-[10px] text-warmgrey/80 mt-1.5 leading-relaxed font-light">
              This estimate guides barter matching fairness. Derived from brand status and category.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
              Item Exchange Location
            </label>
            <input
              type="text"
              {...register('city')}
              className="input-box"
              placeholder="Mumbai"
            />
            {errors.city && <p className="text-[11px] text-burgundy font-medium mt-1">{errors.city.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            className="input-box min-h-[120px]"
            placeholder="Introduce the garment. Highlight details like fabric composite, origin, fit guidelines, or frequency of wear..."
          />
          {errors.description && <p className="text-[11px] text-burgundy font-medium mt-1">{errors.description.message}</p>}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full md:w-auto"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-ivory border-t-transparent"></div>
            ) : (
              'Publish Wardrobe Listing'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateListingPage;
