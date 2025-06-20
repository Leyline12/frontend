import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

import TopBar from "../components/TopBar/TopBar";
import SubjectVideoIcon from "../components/Subject/SubjectVideoIcon";
import Button from "../components/Button";
import useCategoryStore from "../store/categoryStore";

// 주제별 분류 화면
export default function SubjectPage() {
  const { subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { findCategoryById, fetchCategories } = useCategoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const Subjectinfo =
    location.state?.Subjectinfo || findCategoryById(parseInt(subjectId));
  const SubjectVideos = Subjectinfo?.videos || [];

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleBackToParent = () => {
    if (Subjectinfo?.parentId) {
      const parentCategory = findCategoryById(Subjectinfo.parentId);
      if (parentCategory) {
        navigate(`/subject/${Subjectinfo.parentId}`, {
          state: { Subjectinfo: parentCategory },
        });
      } else {
        navigate("/"); // 부모를 찾을 수 없으면 홈으로
      }
    } else {
      navigate("/"); // 부모 ID가 없으면 홈으로
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex items-center mb-8 gap-4">
          <Button
            onClick={handleBackToParent}
            variant="icon"
            className="hover:bg-gray-200 p-2 rounded-full"
          >
            <FaArrowLeft className="text-gray-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {Subjectinfo?.name || "주제 없음"}
            </h1>
            <p className="text-gray-500 mt-1">
              {SubjectVideos.length > 0
                ? `${SubjectVideos.length}개의 동영상`
                : "저장된 동영상이 없습니다"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : SubjectVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SubjectVideos.map((video) => (
              <SubjectVideoIcon
                key={`${video.videoId}-${refreshKey}`}
                video={video}
                name={video.userVideoName || "제목 없음"}
                videoId={video.videoId}
                onClick={() => handleVideoClick(video.videoId)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              저장된 동영상이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              이 주제에 동영상을 추가해보세요.
            </p>
            <Button onClick={() => navigate("/")}>동영상 검색하기</Button>
          </div>
        )}
      </div>
    </div>
  );
}
