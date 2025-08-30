'use client';

import React, { useEffect, useState } from 'react';
import { FileUploader } from '@/presentation/components/upload/FileUploader';
import { MapViewer } from '@/presentation/components/map/MapViewer';
import { FilterPanel } from '@/presentation/components/filter/FilterPanel';
import { BattleDetails } from '@/presentation/components/battle/BattleDetails';
import { useBattleStore } from '@/presentation/store/battleStore';
import { useFilterStore } from '@/presentation/store/filterStore';
import { useUploadStore } from '@/presentation/store/uploadStore';
import { BattleRepository } from '@/infrastructure/repositories/BattleRepository';
import { BattleDataParser } from '@/application/services/BattleDataParser';
import { UploadBattleDataUseCase } from '@/application/usecases/UploadBattleData';
import { GetBattleDataUseCase } from '@/application/usecases/GetBattleData';
import { FilterBattleDataUseCase } from '@/application/usecases/FilterBattleData';
import { Battle } from '@/domain/entities/Battle';

export default function MainPage() {
  const [availableMaps, setAvailableMaps] = useState<number[]>([]);
  const [availableMembers, setAvailableMembers] = useState<string[]>([]);
  const [filteredBattles, setFilteredBattles] = useState<Battle[]>([]);

  const { battles, selectedBattle, setBattles, setSelectedBattle, setLoading, setError } = useBattleStore();
  const { filters, setCounts } = useFilterStore();
  const { files, status, progress, errors, addFiles, updateFileStatus, setStatus, setProgress, addError, clearErrors } = useUploadStore();

  // 의존성 주입
  const repository = new BattleRepository();
  const parser = new BattleDataParser();
  const uploadUseCase = new UploadBattleDataUseCase(repository, parser);
  const getDataUseCase = new GetBattleDataUseCase(repository);
  const filterUseCase = new FilterBattleDataUseCase();

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [battlesData, mapsData, membersData] = await Promise.all([
          getDataUseCase.getAll(),
          getDataUseCase.getAvailableMaps(),
          getDataUseCase.getAvailableMembers()
        ]);
        
        setBattles(battlesData);
        setAvailableMaps(mapsData);
        setAvailableMembers(membersData);
        setCounts(battlesData.length, battlesData.length);
      } catch (error) {
        setError(error instanceof Error ? error.message : '데이터 로드 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // 필터링 적용
  useEffect(() => {
    const filtered = filterUseCase.execute(battles, filters);
    setFilteredBattles(filtered);
    setCounts(battles.length, filtered.length);
  }, [battles, filters]);

  // 파일 업로드 처리
  const handleFileUpload = async (files: File[]) => {
    try {
      setStatus('uploading');
      setProgress(0);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `${Date.now()}-${i}`;
        
        updateFileStatus(fileId, 'uploading', 0);
        
        try {
          const result = await uploadUseCase.execute([file]);
          
          if (result.success) {
            updateFileStatus(fileId, 'success', 100);
            setProgress(((i + 1) / files.length) * 100);
            
            // 새로운 데이터 다시 로드
            const newBattles = await getDataUseCase.getAll();
            setBattles(newBattles);
            
            const newMaps = await getDataUseCase.getAvailableMaps();
            const newMembers = await getDataUseCase.getAvailableMembers();
            setAvailableMaps(newMaps);
            setAvailableMembers(newMembers);
          } else {
            updateFileStatus(fileId, 'error', 0, result.errors.join(', '));
            result.errors.forEach(error => addError({ fileId, message: error }));
          }
        } catch (error) {
          updateFileStatus(fileId, 'error', 0, error instanceof Error ? error.message : '알 수 없는 오류');
          addError({ fileId, message: error instanceof Error ? error.message : '알 수 없는 오류' });
        }
      }

      setStatus('complete');
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.');
    }
  };

  // 필터 변경 처리
  const handleFilterChange = (newFilters: any) => {
    // 필터 스토어에서 자동으로 처리됨
  };

  // 마커 클릭 처리
  const handleMarkerClick = (battle: Battle) => {
    setSelectedBattle(battle);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">DepthFantasia</h1>
          <p className="text-sm text-gray-600">전투 데이터 시각화</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 파일 업로드 */}
          <div>
            <h2 className="text-lg font-semibold mb-2">데이터 업로드</h2>
            <FileUploader onUpload={handleFileUpload} />
            
            {/* 업로드 상태 표시 */}
            {status !== 'idle' && (
              <div className="mt-2">
                <div className="text-sm text-gray-600">
                  {status === 'uploading' && '업로드 중...'}
                  {status === 'processing' && '처리 중...'}
                  {status === 'complete' && '완료!'}
                  {status === 'error' && '오류 발생'}
                </div>
                {status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 필터 패널 */}
          <div>
            <h2 className="text-lg font-semibold mb-2">필터</h2>
            <FilterPanel
              onFilterChange={handleFilterChange}
              availableMaps={availableMaps}
              availableMembers={availableMembers}
            />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <MapViewer
            battles={filteredBattles}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>

      {/* 정보 패널 */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">전투 상세정보</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {selectedBattle ? (
            <BattleDetails battle={selectedBattle} />
          ) : (
            <div className="p-4 text-gray-500 text-center">
              마커를 클릭하여 상세정보를 확인하세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
