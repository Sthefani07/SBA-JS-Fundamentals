// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];


// Check if the assignment group belongs to the couse.
function isValidCourseAssignmentGroup(CourseInfo,AssignmentGroup) {
  if(CourseInfo.id === AssignmentGroup.course_id){
    return true 
  }else{
    return false
  }
}

// console.log(isValidCourseAssignment)  //Testing

//Check if the learner's submission is valid.
function isValidSubmission(submission, assignment) {
  const score = submission.submission.score;
  const pointsPossible = assignment.points_possible;

  if (pointsPossible === 0 || typeof score !== "number" || isNaN(score)){
    return false;
  }else {
    return true;
  }
}
// console.log(isValidCourseAssignment) //Testing

// Calculate the weigth everage of a learner's score.
function calculateWeightedAverage(learnerData){
  return (learnerData.totalScore / learnerData.totalWeigth) * 100;
}
// console.log(calculateWeightedAverage); //Testing



function processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions){
  if (!isValidCourseAssignmentGroup(CourseInfo, AssignmentGroup)){
    throw new Error("Invalid: Assigment does not belong to the couse.");
}

// console.log(processLearnerDataLearnerData) //testing

const assignments = AssignmentGroup.assignments;
const assignmentScore = {};
const learnerData = {};


for(const submission of LearnerSubmissions){
  const learnerID = submission.learner_id;
  const assignmentID = submission.assignment_id;
  const assignment = assignments.find((a) => a.id === assignmentID);

  if(!assignment || new Date(submission.submission.submitted_at) > new Date(assignment.due_at)){
    continue;
  }

//Apply late penalty if applicable
if(new Date(submission.submission.submitted_at) > new Date(assignment.due_at)){
  points *= 0.9; // Deduct 10% of the possible points
}

  if (isValidSubmission(submission, assignment)){
    if (!learnerData[learnerID]){
      learnerData[learnerID] = {
        id: learnerID,
        totalScore: 0,
        totalweigth: 0,
      };
    }

    const score = submission.submission.score;
    const pointsPossible = assignment.points_possible;
    learnerData[learnerID].totalScore += pointsPossible;
    assignmentScore[assignmentID] = (score / pointsPossible) * 100
  }
}
return {learnerData, assignmentScore};
}


function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions){
  try{
    const { learnerData, assignmentScore} = processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

    const results = [];

    for (const learnerID in learnerData){
      const learner = learnerData[learnerID];
      const weigthedAverage = calculateWeightedAverage(learner);

      const learnerResult = {
        id: learner.id,
        avg: weigthedAverage,
      };

      for (const assignmentID in assignmentScore){
        learnerResult[assignmentID] = assignmentScore[assignmentID];
      }

      results.push(learnerResult);
    }

    return results;

  } catch(error){
  console.error(error.message);
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);