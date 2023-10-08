const CourseIdPage = ({
  params,
}: {
  params: {
    courseId: string
  }
}) => {
  return <div className="text-start">{params.courseId}</div>
}

export default CourseIdPage
