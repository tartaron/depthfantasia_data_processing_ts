# 통합 및 테스트

## 메인 페이지 레이아웃

### app/page.tsx
const MainPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-80">
        <FileUploader />
        <FilterPanel />
      </Sidebar>
      <MainContent className="flex-1">
        <MapViewer />
      </MainContent>
      <InfoPanel className="w-64">
        <BattleDetails />
        <Statistics />
      </InfoPanel>
    </div>
  );
};

## 전역 상태 연결

### presentation/hooks/useBattleData.ts
const useBattleData = () => {
  const { filters } = useFilterStore();
  const { data: battles } = useQuery({
    queryKey: ['battles', filters],
    queryFn: () => filterBattleData(battles, filters)
  });
  
  return { battles, isLoading, error };
};

## Mock API

### infrastructure/api/mockApi.ts
class MockBattleAPI {
  private battles: Battle[] = sampleData;
  
  async uploadBattles(data: Battle[]): Promise<void> {
    this.battles.push(...data);
  }
  
  async getBattles(filters?: FilterOptions): Promise<Battle[]> {
    return this.filterBattles(this.battles, filters);
  }
}

## 테스트 시나리오
1. 파일 업로드 → 데이터 파싱 → 맵 표시
2. 필터 적용 → 마커 업데이트
3. 마커 클릭 → 상세정보 표시
4. 대용량 데이터 처리 (10,000개 이상)

## 성능 체크리스트
- [ ] 맵 타일 로딩 최적화
- [ ] 마커 클러스터링 (1000개 이상일 때)
- [ ] 필터링 디바운싱
- [ ] 메모리 사용량 모니터링

## 배포 준비
- 환경 변수 설정
- 빌드 최적화
- 에러 로깅 설정
