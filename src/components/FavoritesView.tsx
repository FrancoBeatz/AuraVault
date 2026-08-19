import React from 'react';
import { Heart, Plus, ShieldCheck, ExternalLink } from 'lucide-react';
import { DiscoveredEntity } from '../types';

interface FavoritesViewProps {
  favoriteEntities: DiscoveredEntity[];
  onSelectEntity: (entity: DiscoveredEntity) => void;
  onQuickAdd: (entity: DiscoveredEntity) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteEntities,
  onSelectEntity,
  onQuickAdd,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <span>Bookmarked Identity Targets</span>
          </h2>
          <p className="text-xs text-stone-400">Pinned high-confidence profile nodes</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
          {favoriteEntities.length} Pinned
        </span>
      </div>

      {favoriteEntities.length === 0 ? (
        <div className="text-center py-16 text-stone-500 space-y-3">
          <Heart className="h-10 w-10 text-stone-600 mx-auto" />
          <p className="text-sm font-semibold text-stone-400">No identities bookmarked</p>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Tap the heart icon on any discovered card to pin the node for rapid investigation tracking!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favoriteEntities.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectEntity(item)}
              className="bg-[#17191d] border border-white/10 hover:border-white/20 rounded-2xl p-3 space-y-2.5 transition-all flex flex-col justify-between cursor-pointer group shadow-md"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                <p className="text-[10px] text-stone-400 font-mono truncate">{item.handle}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-mono font-bold text-emerald-400 text-xs">{item.confidenceScore}%</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(item);
                  }}
                  className="h-7 w-7 rounded-lg bg-[#007A4D] hover:bg-[#008f5a] text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-sm"
                  title="Add to dossier"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
