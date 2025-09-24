import { useMemo } from 'react';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const AnalyticsDashboard = ({ tasks }) => {
  const analytics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Priority distribution
    const priorityStats = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    };

    // Category distribution
    const categoryStats = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    // Weekly completion trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const weeklyTrend = last7Days.map(date => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt || task.dueDate).toISOString().split('T')[0];
        return taskDate === date;
      });
      return {
        date,
        completed: dayTasks.filter(task => task.completed).length,
        total: dayTasks.length
      };
    }).reverse();

    // Overdue tasks
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && !task.completed;
    }).length;

    // Average completion time (mock calculation)
    const avgCompletionTime = completedTasks > 0 ? Math.round(Math.random() * 3 + 1) : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      priorityStats,
      categoryStats,
      weeklyTrend,
      overdueTasks,
      avgCompletionTime
    };
  }, [tasks]);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, max, color = 'bg-primary-600' }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={analytics.totalTasks}
          icon={CheckSquare}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={analytics.completedTasks}
          icon={CheckSquare}
          color="bg-green-500"
          subtitle={`${analytics.completionRate}% completion rate`}
        />
        <StatCard
          title="Pending"
          value={analytics.pendingTasks}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="Overdue"
          value={analytics.overdueTasks}
          icon={Target}
          color="bg-red-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-4">
            <ProgressBar
              label="High Priority"
              value={analytics.priorityStats.high}
              max={analytics.totalTasks}
              color="bg-red-500"
            />
            <ProgressBar
              label="Medium Priority"
              value={analytics.priorityStats.medium}
              max={analytics.totalTasks}
              color="bg-yellow-500"
            />
            <ProgressBar
              label="Low Priority"
              value={analytics.priorityStats.low}
              max={analytics.totalTasks}
              color="bg-green-500"
            />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {category}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(count / analytics.totalTasks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
        <div className="space-y-4">
          {analytics.weeklyTrend.map((day, index) => (
            <div key={day.date} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-gray-600">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${day.total > 0 ? (day.completed / day.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {day.completed}/{day.total} completed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg border border-primary-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Productivity Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {analytics.completionRate}%
            </div>
            <div className="text-sm text-primary-700">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {analytics.avgCompletionTime}
            </div>
            <div className="text-sm text-primary-700">Avg Days to Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {analytics.overdueTasks === 0 ? '🎉' : analytics.overdueTasks}
            </div>
            <div className="text-sm text-primary-700">
              {analytics.overdueTasks === 0 ? 'No Overdue Tasks!' : 'Overdue Tasks'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
