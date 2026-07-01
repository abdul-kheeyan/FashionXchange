import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="section-pad max-w-7xl mx-auto flex flex-col justify-center items-center h-[70vh] text-center">
      <span className="font-sans text-xs tracking-widest uppercase text-champagne font-semibold mb-4">
        Error 404
      </span>
      <h1 className="font-serif text-5xl text-onyx font-light mb-6">
        Aesthetic Misalignment
      </h1>
      <p className="font-sans text-sm text-warmgrey max-w-md mb-8 leading-relaxed font-light">
        The archive page or wardrobe listing you seek has either transitioned out of style or does not exist.
      </p>
      <Link to="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
