'use client';

import React, { useState, useEffect } from 'react';
import { useFilterStore } from '@/presentation/store/filterStore';
import { FilterOptions } from '@/domain/entities/Filter';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableMaps: number[];
  availableMembers: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange,
  availableMaps,
  availableMembers
}) => {
  const { filters, setFilter, resetFilters, totalCount, filteredCount } = useFilterStore();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = availableMembers.filter(member =>
    member.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemberToggle = (member: string) => {
    const newMembers = selectedMembers.includes(member)
      ? selectedMembers.filter(m => m !== member)
      : [...selectedMembers, member];
    
    setSelectedMembers(newMembers);
    setFilter('memberNames', newMembers);
  };

  const handleMapChange = (mapId: string) => {
    const value = mapId === '' ? undefined : parseInt(mapId);
    setFilter('mapId', value);
  };

  const handleExpRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    setFilter('rewardRange', {
      ...filters.rewardRange,
      [type === 'min' ? 'minExp' : 'maxExp']: numValue
    });
  };

  const handleGoldRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    setFilter('rewardRange', {
      ...filters.rewardRange,
      [type === 'min' ? 'minGold' : 'maxGold']: numValue
    });
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">필터</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          초기화
        </button>
      </div>

      {/* 맵 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          맵 선택
        </label>
        <select
          value={filters.mapId?.toString() || ''}
          onChange={(e) => handleMapChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">모든 맵</option>
          {availableMaps.map(mapId => (
            <option key={mapId} value={mapId}>맵 {mapId}</option>
          ))}
        </select>
      </div>

      {/* 멤버 검색 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          멤버 검색
        </label>
        <input
          type="text"
          placeholder="멤버 이름 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <div className="mt-2 max-h-32 overflow-y-auto">
          {filteredMembers.map(member => (
            <label key={member} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedMembers.includes(member)}
                onChange={() => handleMemberToggle(member)}
                className="rounded"
              />
              <span className="text-sm">{member}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 경험치 범위 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          경험치 범위
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="최소"
            value={filters.rewardRange?.minExp || ''}
            onChange={(e) => handleExpRangeChange('min', e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="최대"
            value={filters.rewardRange?.maxExp || ''}
            onChange={(e) => handleExpRangeChange('max', e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* 골드 범위 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          골드 범위
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="최소"
            value={filters.rewardRange?.minGold || ''}
            onChange={(e) => handleGoldRangeChange('min', e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="최대"
            value={filters.rewardRange?.maxGold || ''}
            onChange={(e) => handleGoldRangeChange('max', e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* 결과 표시 */}
      <div className="pt-2 border-t">
        <p className="text-sm text-gray-600">
          총 {totalCount}개 중 {filteredCount}개 표시
        </p>
      </div>
    </div>
  );
};
