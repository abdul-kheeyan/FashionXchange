import { Link } from 'react-router-dom';
import { formatValue, getConditionColor } from '../utils/valueCalculator';
import { getImageUrl } from '../utils/imageUtils';

const ItemCard = ({ item }) => {
  const imageUrl = getImageUrl(item.images?.[0])

  const conditionColor = getConditionColor(item.condition);

  return (
    <Link to={`/listings/${item._id}`} className="group block bg-transparent">
      {/* Zoom on hover image wrapper */}
      <div className="card-image-wrap aspect-[3/4] relative bg-hairline overflow-hidden border border-hairline transition-all duration-300">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Condition Tag Overlay */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-sans font-medium tracking-wider uppercase px-2 py-1 bg-onyx text-ivory`}>
            {item.condition}
          </span>
        </div>

        {/* Status Overlay */}
        {item.status !== 'Available' && (
          <div className="absolute inset-0 bg-onyx/40 flex items-center justify-center">
            <span className="text-xs font-sans tracking-widest uppercase font-semibold text-ivory border border-ivory px-4 py-2 bg-onyx/80">
              {item.status}
            </span>
          </div>
        )}
      </div>

      {/* Item info */}
      <div className="mt-4 flex flex-col space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="font-serif text-lg text-onyx line-clamp-1 group-hover:text-champagne transition-colors">
            {item.title}
          </h3>
          <span className="font-sans text-xs tracking-wider font-semibold text-champagne shrink-0 ml-2">
            {formatValue(item.estimatedValue)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-warmgrey">
          <span className="tracking-widest uppercase text-[10px] font-medium text-warmgrey">
            {item.brand} • {item.size}
          </span>
          {item.location?.city && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-warmgrey/70">
              {item.location.city} {item.distance !== undefined && `(${item.distance} km)`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
