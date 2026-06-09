import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  addRecentActivity,
  getCourseProgress,
  setCourseProgress,
} from "../utils/learningSync";

const API_BASE = "http://localhost:5000/api";

const normalizeTopic = (topic) => {
  if (typeof topic === "string") {
    return {
      id: null,
      topic,
      title: topic,
      video_url: "",
    };
  }

  return {
    ...topic,
    id: topic?.id ?? null,
    topic: topic?.topic ?? topic?.title ?? topic?.name ?? "Untitled lesson",
    title: topic?.topic ?? topic?.title ?? topic?.name ?? "Untitled lesson",
    video_url: topic?.video_url ?? "",
  };
};

const getTopicKey = (topic) =>
  topic?.id ? String(topic.id) : String(topic?.topic ?? topic ?? "");

const getYouTubeEmbedUrl = (url) => {
  const value = String(url || "").trim();

  if (!value) return "";

  const embedMatch = value.match(
    /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([^/?&\s]+)/i
  );

  if (embedMatch?.[1]) {
    return `https://www.youtube.com/embed/${embedMatch[1]}`;
  }

  const shortMatch = value.match(
    /^https?:\/\/youtu\.be\/([^?&/\s]+)(?:\?.*)?$/i
  );

  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const watchMatch = value.match(
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^&\s]+).*$/i
  );

  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  return "";
};

const isYouTubeUrl = (url) =>
  /(?:youtube\.com|youtu\.be)/i.test(String(url || ""));

const getFirstTopic = (curriculum) => {
  for (const module of curriculum || []) {
    if (Array.isArray(module?.topics) && module.topics.length > 0) {
      return module.topics[0];
    }
  }

  return null;
};

const LearningContent = ({
  course,
  curriculum,
  loading,
  error,
  notes,
  quizzes,
  selectedAnswers,
  setSelectedAnswers,
  quizScore,
  submitQuiz,
}) => {
  const videoRef = useRef(null);
  const lastSavedSecondRef = useRef(0);

  const normalizedCurriculum = useMemo(
    () =>
      Array.isArray(curriculum)
        ? curriculum.map((module) => ({
            ...module,
            topics: Array.isArray(module?.topics)
              ? module.topics.map(normalizeTopic)
              : [],
          }))
        : [],
    [curriculum]
  );

  const allTopics = useMemo(
    () =>
      normalizedCurriculum.flatMap((module) =>
        Array.isArray(module?.topics) ? module.topics : []
      ),
    [normalizedCurriculum]
  );

  const totalLessons = allTopics.length;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.user?.id || user?.id;

  const [activeTopic, setActiveTopic] = useState(() =>
    getFirstTopic(normalizedCurriculum)
  );
  const [completedTopicKeys, setCompletedTopicKeys] = useState([]);
  const [resumeTopicId, setResumeTopicId] = useState(null);
  const [resumeWatchTime, setResumeWatchTime] = useState(0);
  const [videoLoading, setVideoLoading] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);

  useEffect(() => {
    if (!activeTopic && normalizedCurriculum.length > 0) {
      setActiveTopic(getFirstTopic(normalizedCurriculum));
    }
  }, [activeTopic, normalizedCurriculum]);

  useEffect(() => {
    if (!course?.id || totalLessons === 0) return;

    const savedTopics = localStorage.getItem(`completedTopics-${course.id}`);
    const legacyProgress = localStorage.getItem(`progress-${course.id}`);

    try {
      if (savedTopics) {
        const parsedTopics = JSON.parse(savedTopics);
        if (Array.isArray(parsedTopics)) {
          const restoredKeys = parsedTopics
            .map((savedTopic) => {
              const match = allTopics.find(
                (topic) =>
                  getTopicKey(topic) === String(savedTopic) ||
                  topic?.topic === savedTopic
              );
              return match ? getTopicKey(match) : String(savedTopic);
            })
            .filter(Boolean);

          setCompletedTopicKeys(restoredKeys);
          return;
        }
      }

      if (legacyProgress) {
        const parsedProgress = JSON.parse(legacyProgress);
        const completedCount = Array.isArray(parsedProgress)
          ? parsedProgress.length
          : Math.round((Number(parsedProgress) / 100) * totalLessons);

        setCompletedTopicKeys(
          allTopics.slice(0, completedCount).map(getTopicKey)
        );
      }
    } catch (storageError) {
      console.log(storageError);
      setCompletedTopicKeys([]);
    }
  }, [allTopics, course?.id, totalLessons]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const resumeResponse = await axios.get(
          `${API_BASE}/progress/resume/${course?.id}`,
          {
            params: {
              user_id: userId,
            },
          }
        );

        const completedRows = Array.isArray(
          resumeResponse.data?.completed_topics
        )
          ? resumeResponse.data.completed_topics
          : [];

        const completedKeys = completedRows
          .filter((item) => Number(item?.completed) === 1)
          .map((item) => String(item?.topic_id))
          .filter(Boolean);

        if (completedKeys.length > 0) {
          setCompletedTopicKeys(completedKeys);
        }

        const lastTopicId = resumeResponse.data?.resume?.last_topic_id;
        const watchTime = Number(resumeResponse.data?.resume?.watch_time) || 0;
        const resumeTopic = allTopics.find(
          (topic) => String(topic?.id) === String(lastTopicId)
        );

        if (resumeTopic) {
          setResumeTopicId(lastTopicId);
          setResumeWatchTime(watchTime);
          setActiveTopic(resumeTopic);
        }
      } catch (resumeError) {
        console.log(resumeError);

        try {
          const response = await axios.get(
            `${API_BASE}/progress/${userId}/${course?.id}`
          );

          const savedProgress = response.data?.progress;

          if (savedProgress) {
            const restoredTopics = allTopics.slice(
              0,
              Number(savedProgress.completed_lessons) || 0
            );

            setCompletedTopicKeys(restoredTopics.map(getTopicKey));

            if (restoredTopics.length > 0) {
              setActiveTopic(restoredTopics[restoredTopics.length - 1]);
            }
          }
        } catch (legacyError) {
          console.log(legacyError);
        }
      }
    };

    if (userId && course?.id && allTopics.length > 0) {
      fetchProgress();
    }
  }, [allTopics, course?.id, userId]);

  const progress =
    totalLessons > 0
      ? Math.round((completedTopicKeys.length / totalLessons) * 100)
      : 0;

  useEffect(() => {
    if (!course?.id || totalLessons === 0) return;

    const savedProgress = getCourseProgress(course);

    if (completedTopicKeys.length > 0 || savedProgress === 0) {
      setCourseProgress(course, Math.max(savedProgress, progress));
    }
  }, [completedTopicKeys.length, course, progress, totalLessons]);

  useEffect(() => {
    lastSavedSecondRef.current = 0;
    setVideoLoading(Boolean(activeTopic?.video_url));
  }, [activeTopic]);

  const persistWatchTime = async (watchTime, topicOverride = activeTopic) => {
    if (!userId || !course?.id || !topicOverride?.id) return;

    try {
      await axios.put(`${API_BASE}/progress/watch-time`, {
        user_id: userId,
        course_id: course.id,
        topic_id: topicOverride.id,
        watch_time: Math.max(0, Math.floor(Number(watchTime) || 0)),
      });
    } catch (watchError) {
      console.log(watchError);
    }
  };

  const handleVideoTimeUpdate = () => {
    const currentSecond = Math.floor(videoRef.current?.currentTime || 0);

    if (
      currentSecond > 0 &&
      Math.abs(currentSecond - lastSavedSecondRef.current) >= 10
    ) {
      lastSavedSecondRef.current = currentSecond;
      persistWatchTime(currentSecond);
    }
  };

  const handleLoadedMetadata = () => {
    setVideoLoading(false);

    if (
      videoRef.current &&
      activeTopic?.id &&
      String(activeTopic.id) === String(resumeTopicId) &&
      resumeWatchTime > 0
    ) {
      videoRef.current.currentTime = resumeWatchTime;
    }
  };

  const markTopicComplete = async () => {
    if (totalLessons === 0 || !activeTopic) return;

    const activeKey = getTopicKey(activeTopic);

    if (completedTopicKeys.includes(activeKey)) return;

    const updatedTopicKeys = [...completedTopicKeys, activeKey];
    const updatedProgress = Math.round(
      (updatedTopicKeys.length / totalLessons) * 100
    );

    setCompletedTopicKeys(updatedTopicKeys);

    localStorage.setItem(
      `completedTopics-${course?.id}`,
      JSON.stringify(updatedTopicKeys)
    );

    setCourseProgress(course, updatedProgress);

    addRecentActivity({
      type: "lesson_completed",
      course: course.title,
    });

    try {
      await axios.put(`${API_BASE}/progress/complete`, {
        user_id: userId,
        course_id: course?.id,
        topic_id: activeTopic?.id,
        completed_lessons: updatedTopicKeys.length,
        progress_percent: updatedProgress,
      });
    } catch (topicProgressError) {
      console.log(topicProgressError);
    }

    try {
      await axios.post(`${API_BASE}/progress`, {
        user_id: userId,
        course_id: course?.id,
        lesson_index: updatedTopicKeys.length - 1,
        completed_lessons: updatedTopicKeys.length,
        progress_percent: updatedProgress,
      });
    } catch (legacyProgressError) {
      console.log(legacyProgressError);
    }
  };

  const handleSelectTopic = (topic) => {
    setActiveTopic(topic);
    setResumeWatchTime(0);
    persistWatchTime(0, topic);
  };

  const generateCertificate = async () => {
    if (certificateLoading) return;

    const studentName =
      localStorage.getItem("studentName") ||
      user?.name ||
      user?.user?.name ||
      "Student";

    const completionDate = new Date().toLocaleDateString();

    setCertificateLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/certificates/generate`, {
        user_email: user?.email || user?.user?.email || "",
        course_slug: course?.slug || String(course?.id || ""),
        student_name: studentName,
        completion_date: completionDate,
      });

      if (response.data?.success) {
        localStorage.setItem(
          `certificateData-${course?.id}`,
          JSON.stringify(response.data.certificate)
        );
      }
    } catch (certificateError) {
      console.log(certificateError);
    } finally {
      localStorage.setItem(`completed-${course?.id}`, "true");
      localStorage.setItem(`certificate-${course?.id}`, "true");
      localStorage.setItem("studentName", studentName);

      addRecentActivity({
        type: "certificate_downloaded",
        course: course.title,
      });

      window.location.href = `/certificate/${course?.id}`;
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Course not found
      </div>
    );
  }

  const activeTopicTitle = activeTopic?.topic || "Select a lesson";
  const rawVideoUrl = String(activeTopic?.video_url || "").trim();
  const youTubeEmbedUrl = getYouTubeEmbedUrl(rawVideoUrl);
  const isYouTubeVideo = isYouTubeUrl(rawVideoUrl);
  const activeVideoUrl = isYouTubeVideo
    ? youTubeEmbedUrl
    : rawVideoUrl;

  return (
    <div className="min-h-screen bg-[#f5f2ee] dark:bg-[#0f172a] dark:text-gray-100 pt-28 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-10">
        <div>
          <div className="bg-black rounded-3xl overflow-hidden mb-8 shadow-xl min-h-[320px] flex items-center justify-center">
            {activeVideoUrl ? (
              <div className="w-full">
                {videoLoading && (
                  <div className="text-white text-center py-4">
                    Loading video...
                  </div>
                )}

                {isYouTubeVideo ? (
                  <iframe
                    key={getTopicKey(activeTopic)}
                    width="100%"
                    height="600"
                    src={activeVideoUrl}
                    title={activeTopicTitle}
                    className="w-full bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => {
                      setVideoLoading(false);
                      persistWatchTime(0);
                    }}
                  ></iframe>
                ) : (
                  <video
                    key={getTopicKey(activeTopic)}
                    ref={videoRef}
                    controls
                    width="100%"
                    className="w-full max-h-[600px] bg-black"
                    onLoadedMetadata={handleLoadedMetadata}
                    onCanPlay={() => setVideoLoading(false)}
                    onTimeUpdate={handleVideoTimeUpdate}
                    onPause={() => persistWatchTime(videoRef.current?.currentTime)}
                    onEnded={markTopicComplete}
                  >
                    <source src={activeVideoUrl} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="text-white text-center px-6 py-20">
                <h2 className="text-3xl font-black mb-3">
                  No video available
                </h2>
                <p className="text-gray-300">
                  This lesson does not have a video yet.
                </p>
              </div>
            )}
          </div>

          <h1 className="text-5xl font-black mb-6">{course?.title}</h1>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 px-6 py-4 rounded-2xl shadow">
              <p className="text-gray-400 text-sm">Category</p>
              <h3 className="font-bold">{course?.category}</h3>
            </div>

            <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 px-6 py-4 rounded-2xl shadow">
              <p className="text-gray-400 text-sm">Students</p>
              <h3 className="font-bold">{course?.students}</h3>
            </div>

            <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 px-6 py-4 rounded-2xl shadow">
              <p className="text-gray-400 text-sm">Rating</p>
              <h3 className="font-bold text-yellow-500">* {course?.rating}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-3xl p-8 shadow-lg mb-8">
            <h2 className="text-3xl font-black mb-5">Current Lesson</h2>

            <p className="text-2xl text-red-500 font-bold mb-5">
              {activeTopicTitle}
            </p>

            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Learn this topic step-by-step with practical examples and
              real-world implementation.
            </p>

            <div className="flex flex-wrap gap-3">
              {resumeTopicId && activeTopic?.id !== resumeTopicId && (
                <button
                  onClick={() => {
                    const resumeTopic = allTopics.find(
                      (topic) => String(topic?.id) === String(resumeTopicId)
                    );
                    if (resumeTopic) setActiveTopic(resumeTopic);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold"
                >
                  Continue Learning
                </button>
              )}

              <button
                onClick={markTopicComplete}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-bold"
              >
                Mark Lesson Complete
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-3xl p-8 shadow-lg mb-8">
            <h2 className="text-3xl font-black mb-5">Course Completion</h2>

            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              Complete at least 80% of the course to unlock your certificate.
            </p>

            <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full ${
                  progress >= 80 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="font-bold text-lg mb-6">Progress : {progress}%</p>

            {progress >= 80 ? (
              <div>
                <div className="bg-green-100 text-green-600 px-6 py-4 rounded-2xl font-bold text-lg mb-5 inline-block">
                  Course Completed
                </div>

                <br />

                <button
                  onClick={generateCertificate}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold"
                >
                  {certificateLoading ? "Generating..." : "Download Certificate"}
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  alert("Complete at least 80% progress to unlock certificate.")
                }
                className="bg-gray-400 text-white px-8 py-4 rounded-2xl font-bold cursor-not-allowed"
              >
                Certificate Locked
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-3xl p-8 shadow-lg mb-8">
            <h2 className="text-3xl font-black mb-6">Course Notes</h2>

            {Array.isArray(notes) && notes.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-5">
                {notes.map((note) => (
                  <a
                    key={note.id}
                    href={note.note_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl p-5 transition border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm text-gray-500 mb-2">
                      Download Resource
                    </p>
                    <h3 className="text-xl font-black text-red-500">
                      {note.title}
                    </h3>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No notes available for this course.
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-3xl p-8 shadow-lg mb-8">
            <h2 className="text-3xl font-black mb-6">Course Quiz</h2>

            {Array.isArray(quizzes) && quizzes.length > 0 ? (
              <div className="space-y-8">
                {quizzes.map((quiz, quizIndex) => {
                  const options = [
                    ["A", quiz.option_a],
                    ["B", quiz.option_b],
                    ["C", quiz.option_c],
                    ["D", quiz.option_d],
                  ];

                  return (
                    <div
                      key={quiz.id}
                      className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-xl font-black mb-5">
                        {quizIndex + 1}. {quiz.question}
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        {options.map(([optionKey, optionValue]) => (
                          <button
                            key={optionKey}
                            onClick={() =>
                              setSelectedAnswers((currentAnswers) => ({
                                ...currentAnswers,
                                [quiz.id]: optionKey,
                              }))
                            }
                            className={`text-left px-5 py-4 rounded-2xl transition font-medium ${
                              selectedAnswers[quiz.id] === optionKey
                                ? "bg-red-500 text-white"
                                : "bg-white dark:bg-[#111827] hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            {optionKey}. {optionValue}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={submitQuiz}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold"
                >
                  Submit Quiz
                </button>

                {quizScore !== null && (
                  <div className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200 px-6 py-4 rounded-2xl font-bold text-lg inline-block">
                    You Scored {quizScore} / {quizzes.length}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No quiz available for this course.</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] dark:border dark:border-gray-700 rounded-3xl p-8 shadow-xl h-fit sticky top-28">
          <h2 className="text-4xl font-black mb-8">Course Curriculum</h2>

          <div className="space-y-8">
            {loading ? (
              <p className="text-gray-500">Loading curriculum...</p>
            ) : error ? (
              <div className="rounded-3xl bg-red-50 dark:bg-red-950 p-8 text-red-900 dark:text-red-200">
                <h3 className="text-2xl font-semibold mb-2">
                  Course curriculum could not be loaded.
                </h3>
                <p>Please refresh the page or try again later.</p>
              </div>
            ) : normalizedCurriculum.length > 0 ? (
              normalizedCurriculum.map((module, index) => (
                <div key={module?.id ?? index} className="border-b pb-6">
                  <div className="mb-5">
                    <h3 className="text-2xl font-black mb-2">
                      {module?.title}
                    </h3>
                    <p className="text-gray-500">{module?.lessons}</p>
                  </div>

                  <div className="space-y-3">
                    {module?.topics?.map((topic, topicIndex) => {
                      const topicKey = getTopicKey(topic);
                      const isCompleted = completedTopicKeys.includes(topicKey);
                      const isActive = getTopicKey(activeTopic) === topicKey;

                      return (
                        <button
                          key={topic?.id ?? `${topic?.topic}-${topicIndex}`}
                          onClick={() => handleSelectTopic(topic)}
                          className={`w-full text-left px-5 py-4 rounded-2xl transition font-medium ${
                            isActive
                              ? "bg-red-500 text-white"
                              : isCompleted
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          {isCompleted ? "✓" : "▶"} {topic?.topic}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No curriculum available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LearningPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const routeSlug = String(slug ?? "").trim();

  const [sqlCourse, setSqlCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [curriculumError, setCurriculumError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCourseAndCurriculum = async () => {
      if (!routeSlug) {
        setSqlCourse(null);
        setCurriculum([]);
        setNotes([]);
        setQuizzes([]);
        setSelectedAnswers({});
        setQuizScore(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setCurriculumError(false);
      setNotes([]);
      setQuizzes([]);
      setSelectedAnswers({});
      setQuizScore(null);

      try {
        const courseResponse = await axios.get(
          `${API_BASE}/courses/${routeSlug}`
        );

        if (isMounted && courseResponse.data?.success) {
          setSqlCourse(courseResponse.data.course);

          const curriculumResponse = await axios.get(
            `${API_BASE}/curriculum/${routeSlug}`
          );

          if (curriculumResponse.data?.success) {
            const raw = Array.isArray(curriculumResponse.data.curriculum)
              ? curriculumResponse.data.curriculum
              : [];

            setCurriculum(
              raw.map((module) => ({
                ...module,
                topics: Array.isArray(module?.topics)
                  ? module.topics.map(normalizeTopic)
                  : [],
              }))
            );
            setCurriculumError(false);
          } else {
            setCurriculum([]);
            setCurriculumError(true);
          }

          try {
            const notesResponse = await axios.get(
              `${API_BASE}/notes/${routeSlug}`
            );

            if (notesResponse.data?.success) {
              setNotes(
                Array.isArray(notesResponse.data.notes)
                  ? notesResponse.data.notes
                  : []
              );
            }
          } catch (notesError) {
            console.log(notesError);
            setNotes([]);
          }

          try {
            const quizResponse = await axios.get(
              `${API_BASE}/quizzes/${routeSlug}`
            );

            if (quizResponse.data?.success) {
              setQuizzes(
                Array.isArray(quizResponse.data.quizzes)
                  ? quizResponse.data.quizzes
                  : []
              );
            }
          } catch (quizError) {
            console.log(quizError);
            setQuizzes([]);
          }
        }
      } catch (fetchError) {
        if (isMounted) {
          console.error("Failed to load course/curriculum", fetchError);
          setSqlCourse(null);
          setCurriculum([]);
          setNotes([]);
          setQuizzes([]);
          setSelectedAnswers({});
          setQuizScore(null);
          setCurriculumError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourseAndCurriculum();

    return () => {
      isMounted = false;
    };
  }, [routeSlug]);

  const course = sqlCourse
    ? {
        id: sqlCourse.id,
        slug: sqlCourse.slug,
        title: sqlCourse.title,
        category: sqlCourse.category,
        description: sqlCourse.description,
        image: sqlCourse.image,
        price: sqlCourse.price,
        rating: sqlCourse.rating,
        lessons: sqlCourse.lessons,
        students: sqlCourse.students,
        duration: sqlCourse.duration,
        level: sqlCourse.level,
        about: sqlCourse.about,
        instructor_name: sqlCourse.instructor_name,
        instructor_role: sqlCourse.instructor_role,
        instructor_image: sqlCourse.instructor_image,
        language: sqlCourse.language,
        certificate: sqlCourse.certificate,
      }
    : null;

  const enrolledCourses = (() => {
    try {
      return JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    } catch {
      return [];
    }
  })();

  const isEnrolled =
    Array.isArray(enrolledCourses) &&
    enrolledCourses.some((item) =>
      typeof item === "string" ? item === routeSlug : item?.slug === routeSlug
    );

  const submitQuiz = () => {
    const score = quizzes.reduce((totalScore, quiz) => {
      const selectedAnswer = String(selectedAnswers[quiz.id] ?? "")
        .trim()
        .toUpperCase();
      const correctAnswer = String(quiz.correct_answer ?? "")
        .trim()
        .toUpperCase();

      return selectedAnswer === correctAnswer ? totalScore + 1 : totalScore;
    }, 0);

    setQuizScore(score);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020B1F] text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading Course...</h1>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-[#020B1F] text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Please Enroll First</h1>

        <button
          onClick={() => navigate(`/courses/${routeSlug}`)}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold"
        >
          Go To Course
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#020B1F] text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Course Not Available</h1>
      </div>
    );
  }

  return (
    <LearningContent
      course={course}
      curriculum={curriculum}
      loading={loading}
      error={curriculumError}
      notes={notes}
      quizzes={quizzes}
      selectedAnswers={selectedAnswers}
      setSelectedAnswers={setSelectedAnswers}
      quizScore={quizScore}
      submitQuiz={submitQuiz}
    />
  );
};

export default LearningPage;
