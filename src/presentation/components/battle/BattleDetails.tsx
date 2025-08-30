'use client';

import React from 'react';
import { Battle } from '@/domain/entities/Battle';

interface BattleDetailsProps {
  battle: Battle;
}

export const BattleDetails: React.FC<BattleDetailsProps> = ({ battle }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const getMemberType = (isNpc: number) => {
    return isNpc === 0 ? '플레이어' : 'NPC';
  };

  return (
    <div className="p-4 space-y-4">
      {/* 기본 정보 */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          전투 #{battle.id}
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>맵: {battle.map}</p>
          <p>좌표: ({battle.x}, {battle.y})</p>
          <p>층: {battle.floor}</p>
          <p>필드: {battle.field}</p>
          <p>멤버 수: {battle.num_member}명</p>
          <p>이벤트: {battle.is_event ? '예' : '아니오'}</p>
          <p>시간: {formatDate(battle.from)}</p>
        </div>
      </div>

      {/* 보상 정보 */}
      {battle.reward && (
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">보상</h4>
          <div className="text-sm space-y-1">
            <p className="text-green-700">경험치: {battle.reward.exp.toLocaleString()}</p>
            <p className="text-green-700">골드: {battle.reward.gold.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* 멤버 정보 */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">참여 멤버</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {battle.members.map((member, index) => (
            <div
              key={member.id}
              className={`p-2 rounded text-sm ${
                member.is_npc === 0 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-medium ${
                    member.is_npc === 0 ? 'text-blue-800' : 'text-red-800'
                  }`}>
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {getMemberType(member.is_npc)} • 직업: {member.job}
                  </p>
                  {member.guild_name && (
                    <p className="text-xs text-gray-500">길드: {member.guild_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">
                    HP: {member.current_hp}/{member.max_hp}
                  </p>
                  <p className="text-xs text-gray-600">
                    좌표: ({member.x}, {member.y})
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 액션 정보 */}
      {battle.actions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">액션 ({battle.actions.length}개)</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {battle.actions.slice(0, 5).map((action, index) => (
              <div key={action.id} className="text-xs bg-gray-50 p-2 rounded">
                <p className="text-gray-700">
                  {action.type} - 액터: {action.actor}, 타겟: {action.target}
                </p>
                <p className="text-gray-500">값: {action.value}</p>
              </div>
            ))}
            {battle.actions.length > 5 && (
              <p className="text-xs text-gray-500 text-center">
                ... 외 {battle.actions.length - 5}개 더
              </p>
            )}
          </div>
        </div>
      )}

      {/* 결과 정보 */}
      {battle.results.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">결과 ({battle.results.length}개)</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {battle.results.slice(0, 5).map((result, index) => (
              <div key={result.id} className="text-xs bg-gray-50 p-2 rounded">
                <p className="text-gray-700">{result.type}</p>
                <p className="text-gray-500">값: {result.value}</p>
              </div>
            ))}
            {battle.results.length > 5 && (
              <p className="text-xs text-gray-500 text-center">
                ... 외 {battle.results.length - 5}개 더
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
