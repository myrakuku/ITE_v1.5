'use client';

import { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO, addDays, differenceInDays, getDay, addWeeks } from 'date-fns';
import { useRouter } from 'next/navigation';
import { EventDropArg } from '@fullcalendar/core';
import { updateCourseDates } from '@/app/actions/Edit/Edit_AdminCourse/update-course-dates';

type TimeRange = 'morning' | 'afternoon' | 'evening' | 'full_day';

const TimeRangeSchema = z.object({
  timeRange: z.enum(['morning', 'afternoon', 'evening', 'full_day']),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
});

const CourseDateSchema = z.object({
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  weekday: z.string().optional().nullable(),
  classroom: z.string().optional().nullable(),
  timeRanges: z.array(TimeRangeSchema).optional(),
});

type CourseDateForm = z.infer<typeof CourseDateSchema>;

type Course = {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  timeHours: number;
  CourseTimeRanges: {
    id: string;
    courseId: string;
    timeRange: TimeRange;
    starttime: string | null;
    endtime: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  type: string[];
  courseModulId: string | null;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  Coursedates?: string[];
  weekday?: string | null;
  classroom?: string | null;
  createdAt: Date;
  updatedAt: Date;
  Producted: boolean;
  isProduct?: boolean;
  Students?: string[];
  CourseTypes?: string | null;
};

const timeRangeOptions: Record<TimeRange, { label: string; start: string; end: string }> = {
  morning: { label: '上午', start: '09:00', end: '13:00' },
  afternoon: { label: '下午', start: '14:00', end: '18:00' },
  evening: { label: '晚上', start: '19:00', end: '22:00' },
  full_day: { label: '全天', start: '00:00', end: '23:59' },
};

const Edit_Course_Form_Calendar = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [calendarDates, setCalendarDates] = useState<string[]>([]);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // 搜尋關鍵字
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<CourseDateForm>({
    resolver: zodResolver(CourseDateSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      weekday: null,
      classroom: null,
      timeRanges: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'timeRanges',
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedWeekday = watch('weekday');
  const formTimeRanges = watch('timeRanges');

  const weekdays = [
    { value: '0', label: '星期日' },
    { value: '1', label: '星期一' },
    { value: '2', label: '星期二' },
    { value: '3', label: '星期三' },
    { value: '4', label: '星期四' },
    { value: '5', label: '星期五' },
    { value: '6', label: '星期六' },
  ];

  // 根據搜尋關鍵字過濾課程（依 courseCode）
  const filteredCourses = courses.filter((course) =>
    course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch('/api/Course/Get_Course_Lists');
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        const courseData = Array.isArray(data) ? data as Course[] : [];
        setCourses(courseData);
        if (courseData.length > 0) {
          setSelectedCourse(courseData[0]);
          setCalendarDates(courseData[0].Coursedates || []);
          reset({
            startDate: courseData[0].startDate || '',
            endDate: courseData[0].endDate || '',
            weekday: courseData[0].weekday || null,
            classroom: courseData[0].classroom || '',
            timeRanges: courseData[0].CourseTimeRanges.map((range) => ({
              timeRange: range.timeRange,
              startTime: range.starttime || timeRangeOptions[range.timeRange]?.start || '',
              endTime: range.endtime || timeRangeOptions[range.timeRange]?.end || '',
            })),
          });
        } else {
          setSelectedCourse(null);
          setCalendarDates([]);
          reset({
            startDate: '',
            endDate: '',
            weekday: null,
            classroom: '',
            timeRanges: [],
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('無法載入課程數據');
        setCourses([]);
        setSelectedCourse(null);
        setCalendarDates([]);
      }
    };
    fetchCourseData();
  }, [reset]);

  useEffect(() => {
    if (selectedCourse) {
      reset({
        startDate: selectedCourse.startDate || '',
        endDate: selectedCourse.endDate || '',
        weekday: selectedCourse.weekday || null,
        classroom: selectedCourse.classroom || '',
        timeRanges: selectedCourse.CourseTimeRanges.map((range) => ({
          timeRange: range.timeRange,
          startTime: range.starttime || timeRangeOptions[range.timeRange]?.start || '',
          endTime: range.endtime || timeRangeOptions[range.timeRange]?.end || '',
        })),
      });
      setCalendarDates(selectedCourse.Coursedates || []);
    }
  }, [selectedCourse, reset]);

  useEffect(() => {
    if (selectedCourse && startDate && startDate !== '') {
      const start = parseISO(startDate);
      const newDates: string[] = [];

      if (selectedWeekday && selectedWeekday !== '') {
        const targetWeekday = parseInt(selectedWeekday);
        let currentDate = start;
        let count = 0;

        while (getDay(currentDate) !== targetWeekday) {
          currentDate = addDays(currentDate, 1);
        }

        while (count < selectedCourse.numberOfDays) {
          newDates.push(format(currentDate, 'yyyy-MM-dd'));
          currentDate = addWeeks(currentDate, 1);
          count++;
        }
      } else {
        for (let i = 0; i < selectedCourse.numberOfDays; i++) {
          const date = addDays(start, i);
          newDates.push(format(date, 'yyyy-MM-dd'));
        }
      }

      setCalendarDates(newDates);
    } else {
      setCalendarDates([]);
    }
  }, [startDate, selectedWeekday, selectedCourse]);

  useEffect(() => {
    if (selectedCourse && startDate && startDate !== '' && endDate && endDate !== '') {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const daysDifference = differenceInDays(end, start) + 1;
      if (daysDifference < selectedCourse.numberOfDays) {
        setDateRangeError(
          `日期範圍（${daysDifference} 天）少於課程持續天數（${selectedCourse.numberOfDays} 天）`
        );
      } else {
        setDateRangeError(null);
      }
    } else {
      setDateRangeError(null);
    }
  }, [startDate, endDate, selectedCourse]);

  const handleTimeRangeToggle = (timeRange: TimeRange) => {
    const index = formTimeRanges?.findIndex((tr) => tr.timeRange === timeRange) ?? -1;
    if (index >= 0) {
      remove(index);
    } else {
      const { start, end } = timeRangeOptions[timeRange];
      append({ timeRange, startTime: start, endTime: end });
    }
  };

  const onSubmit = async (data: CourseDateForm) => {
    if (!selectedCourse) {
      setError('請選擇一個課程');
      return;
    }

    if (dateRangeError) {
      setError(dateRangeError);
      return;
    }

    try {
      const result = await updateCourseDates({
        courseId: selectedCourse.id,
        ...data,
        Coursedates: calendarDates,
        CourseTimeRanges: data.timeRanges?.map((tr) => ({
          timeRange: tr.timeRange,
          starttime: tr.startTime,
          endtime: tr.endTime,
        })) || [],
      });

      if (!result.success) {
        setError(result.error || '更新課程失敗');
        return;
      }

      if (!result.course) {
        throw new Error('更新成功但未返回課程數據');
      }

      const updatedCourse = result.course as unknown as Course;

      setCourses(courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      ));

      setSelectedCourse(updatedCourse);
      alert('課程更新成功');
      router.push('/admin/CourseLists');
    } catch (error) {
      console.error('Error updating course:', error);
      setError('更新課程失敗，請稍後重試');
    }
  };

  const handleDateClick = (arg: { dateStr: string }) => {
    const clickedDate = arg.dateStr;

    if (startDate && startDate !== '' && endDate && endDate !== '') {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const clicked = parseISO(clickedDate);
      if (clicked < start || clicked > end) {
        setError('只能在開始日期和結束日期之間選擇日期');
        return;
      }
    }

    if (selectedWeekday && selectedWeekday !== '') {
      const clicked = parseISO(clickedDate);
      if (getDay(clicked) !== parseInt(selectedWeekday)) {
        setError(`只能選擇${weekdays.find((w) => w.value === selectedWeekday)?.label}的日期`);
        return;
      }
    }

    let updatedDates: string[];
    if (calendarDates.includes(clickedDate)) {
      updatedDates = calendarDates.filter((date) => date !== clickedDate);
    } else {
      updatedDates = [...calendarDates, clickedDate];
    }

    if (selectedCourse && updatedDates.length > selectedCourse.numberOfDays) {
      setError(`課程日期數量不能超過 ${selectedCourse.numberOfDays} 天`);
      return;
    }

    setCalendarDates(updatedDates);
    setError(null);
  };

  const handleEventDrop = (info: EventDropArg) => {
    const newDate = format(info.event.start!, 'yyyy-MM-dd');
    const oldDate = info.oldEvent.start ? format(info.oldEvent.start, 'yyyy-MM-dd') : null;

    if (startDate && startDate !== '' && endDate && endDate !== '') {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const newDateParsed = parseISO(newDate);
      if (newDateParsed < start || newDateParsed > end) {
        setError('只能在開始日期和結束日期之間拖放日期');
        info.revert();
        return;
      }
    }

    if (selectedWeekday && selectedWeekday !== '') {
      const newDateParsed = parseISO(newDate);
      if (getDay(newDateParsed) !== parseInt(selectedWeekday)) {
        setError(`只能拖放到${weekdays.find((w) => w.value === selectedWeekday)?.label}的日期`);
        info.revert();
        return;
      }
    }

    let updatedDates = [...calendarDates];
    if (oldDate && calendarDates.includes(oldDate)) {
      updatedDates = updatedDates.filter((date) => date !== oldDate);
    }
    if (!updatedDates.includes(newDate)) {
      updatedDates.push(newDate);
    }

    if (selectedCourse && updatedDates.length > selectedCourse.numberOfDays) {
      setError(`課程日期數量不能超過 ${selectedCourse.numberOfDays} 天`);
      info.revert();
      return;
    }

    setCalendarDates(updatedDates);
    setError(null);
  };

  const calendarEvents = calendarDates.map((date) => ({
    title: selectedCourse?.title || '課程',
    date,
    allDay: true,
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
    textColor: '#ffffff',
  }));

  return (
    <div className="shadow-lg">
      <h1 className="text-2xl font-bold mb-6">安排課程</h1>
      {error && (
        <div className="bg-red-600 text-white px-3 py-2 rounded-md mb-6">
          {error}
        </div>
      )}
      {dateRangeError && (
        <div className="bg-red-600 text-white px-3 py-2 rounded-md mb-6">
          {dateRangeError}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 flex flex-col gap-6">
          <div className="bg-gray-800 rounded-md px-3 py-2 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">課程列表</h2>

            {/* 搜尋輸入框 */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="輸入課程代碼搜尋（例如：YOGA-2025）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-2">
                  找到 {filteredCourses.length} 個符合「{searchQuery}」的課程
                </p>
              )}
            </div>

            {/* 課程列表（使用 filteredCourses） */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setSearchQuery(''); // 選擇後清空搜尋欄
                    }}
                    className={`px-3 py-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors ${
                      selectedCourse?.id === course.id ? 'bg-gray-700 ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-300">代碼：{course.courseCode}</p>
                    <p className="text-sm text-gray-300">
                      狀態: {course.Producted ? '已成為產品' : '未成為產品'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  {searchQuery
                    ? `找不到包含「${searchQuery}」的課程`
                    : '沒有可用的課程'}
                </p>
              )}
            </div>
          </div>

          {/* 課程詳情表單 */}
          {selectedCourse && (
            <div className="bg-gray-800 rounded-md px-3 py-2 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">課程詳情</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">開始日期</label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">結束日期</label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm">{errors.endDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">時間段</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedCourse.CourseTimeRanges.length > 0 ? (
                      selectedCourse.CourseTimeRanges.map((range) => (
                        <button
                          key={range.id}
                          type="button"
                          onClick={() => handleTimeRangeToggle(range.timeRange)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            formTimeRanges?.some((tr) => tr.timeRange === range.timeRange)
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          {timeRangeOptions[range.timeRange]?.label || range.timeRange}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-400">無可用時間段</p>
                    )}
                  </div>
                </div>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2 border-b border-gray-600 pb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        {timeRangeOptions[field.timeRange as TimeRange]?.label || field.timeRange}
                      </h3>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        移除
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">開始時間</label>
                      <input
                        type="time"
                        {...register(`timeRanges.${index}.startTime`)}
                        min={timeRangeOptions[field.timeRange as TimeRange].start}
                        max={timeRangeOptions[field.timeRange as TimeRange].end}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">結束時間</label>
                      <input
                        type="time"
                        {...register(`timeRanges.${index}.endTime`)}
                        min={timeRangeOptions[field.timeRange as TimeRange].start}
                        max={timeRangeOptions[field.timeRange as TimeRange].end}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2"
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium">週份</label>
                  <select
                    {...register('weekday')}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2"
                  >
                    <option value="">選擇星期</option>
                    {weekdays.map((weekday) => (
                      <option key={weekday.value} value={weekday.value}>
                        {weekday.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">課室</label>
                  <input
                    type="text"
                    {...register('classroom')}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2"
                    placeholder="輸入課室名稱（可選）"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  更新課程
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 課程月曆 */}
        <div className="md:w-1/2">
          <div className="bg-gray-800 rounded-md px-3 py-2 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">課程月曆</h2>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              dateClick={handleDateClick}
              editable={true}
              selectable={true}
              eventBackgroundColor="#2563eb"
              eventBorderColor="#2563eb"
              eventTextColor="#ffffff"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay',
              }}
              height="auto"
              eventDrop={handleEventDrop}
              validRange={
                startDate && startDate !== '' && endDate && endDate !== ''
                  ? {
                      start: parseISO(startDate),
                      end: addDays(parseISO(endDate), 1),
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit_Course_Form_Calendar;