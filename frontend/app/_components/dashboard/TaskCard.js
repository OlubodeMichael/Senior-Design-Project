import { useState } from "react";
import { format } from "date-fns";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const statusIcons = {
  todo: ClockIcon,
  "in-progress": ExclamationCircleIcon,
  completed: CheckCircleIcon,
};

const statusColors = {
  todo: "text-gray-500",
  "in-progress": "text-yellow-500",
  completed: "text-green-500",
};

export default function TaskCard({ task }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const StatusIcon = statusIcons[task.status] || ClockIcon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`h-5 w-5 ${statusColors[task.status]}`} />
          <h3 className="font-semibold text-lg">{task.title}</h3>
        </div>
        <Badge
          variant="secondary"
          className={priorityColors[task.priority.toLowerCase()]}>
          {task.priority}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className={`text-gray-600 ${isExpanded ? "" : "line-clamp-2"}`}>
          {task.description}
        </p>
        {task.description.length > 150 && (
          <button
            className="text-blue-500 text-sm mt-1 hover:underline"
            onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <div>Project: {task.projectName}</div>
        <div>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</div>
      </CardFooter>
    </Card>
  );
}
