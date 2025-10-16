import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

// Enhanced base card with better shadows and animations
function EnhancedCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col rounded-2xl border border-gray-200/60",
        "shadow-sm hover:shadow-xl transition-all duration-300",
        "backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

// Stat Card - For displaying metrics with icon
interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'primary';
  className?: string;
}

function StatCard({ icon: Icon, value, label, trend, color = 'primary', className }: StatCardProps) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    primary: 'bg-primary/10 text-primary border-primary/20',
  };

  const iconBgMap = {
    blue: 'bg-blue-100/80',
    green: 'bg-green-100/80',
    yellow: 'bg-yellow-100/80',
    purple: 'bg-purple-100/80',
    red: 'bg-red-100/80',
    primary: 'bg-primary/20',
  };

  return (
    <EnhancedCard className={cn("p-6 hover:scale-[1.02] cursor-pointer", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground mb-2">{value}</p>
          {trend && (
            <div className={cn(
              "inline-flex items-center text-sm font-medium",
              trend.positive ? "text-green-600" : "text-red-600"
            )}>
              <span>{trend.positive ? "↑" : "↓"}</span>
              <span className="ml-1">{trend.value}</span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-transform duration-300",
          "group-hover:scale-110",
          colorMap[color],
          iconBgMap[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </EnhancedCard>
  );
}

// Product Card - For costumes and products
interface ProductCardProps {
  image?: string;
  title: string;
  description: string;
  price: number;
  badge?: string;
  rating?: number;
  onView?: () => void;
  href?: string;
  className?: string;
}

function ProductCard({ 
  image, 
  title, 
  description, 
  price, 
  badge, 
  rating = 4.8,
  onView,
  href,
  className 
}: ProductCardProps) {
  const content = (
    <EnhancedCard className={cn("group overflow-hidden hover:scale-[1.02]", className)}>
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5">
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="text-5xl">🎭</span>
              </div>
              <span className="text-xs text-muted-foreground bg-white/80 px-3 py-1 rounded-full">
                View Details
              </span>
            </div>
          </div>
        )}
        
        {/* Badge and Rating Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {badge && (
            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-xs font-medium text-primary rounded-full shadow-sm border border-primary/10">
              {badge}
            </span>
          )}
          {rating && (
            <div className="ml-auto bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm flex items-center gap-1 border border-yellow-100">
              <span className="text-yellow-400">⭐</span>
              <span className="text-xs font-semibold text-gray-700">{rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold text-primary">₱{price.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">per day</div>
          </div>
          <button
            onClick={onView}
            className="px-4 py-2 bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md"
          >
            View Details
          </button>
        </div>
      </div>
    </EnhancedCard>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}

// Feature Card - For benefits/features
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  centered?: boolean;
  iconColor?: string;
  className?: string;
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  centered = true,
  iconColor = 'primary',
  className 
}: FeatureCardProps) {
  return (
    <EnhancedCard className={cn(
      "p-6 hover:scale-[1.02] hover:shadow-2xl",
      "hover:border-primary/20 transition-all duration-300",
      centered && "text-center",
      className
    )}>
      <div className={cn("flex items-start gap-4", centered && "flex-col items-center")}>
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
          "bg-gradient-to-br shadow-lg",
          iconColor === 'primary' && "from-primary/20 to-primary/10 text-primary",
          iconColor === 'blue' && "from-blue-100 to-blue-50 text-blue-600",
          iconColor === 'green' && "from-green-100 to-green-50 text-green-600",
          iconColor === 'purple' && "from-purple-100 to-purple-50 text-purple-600"
        )}>
          <Icon className="w-7 h-7" />
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </EnhancedCard>
  );
}

// Category Card - For category display
interface CategoryCardProps {
  name: string;
  description: string;
  icon?: string;
  image?: string;
  count?: number;
  href?: string;
  className?: string;
}

function CategoryCard({ 
  name, 
  description, 
  icon = '🎭', 
  image,
  count,
  href,
  className 
}: CategoryCardProps) {
  const content = (
    <EnhancedCard className={cn("group overflow-hidden hover:scale-[1.02] h-full flex flex-col", className)}>
      {/* Header with icon/image */}
      <div className="relative h-40 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 overflow-hidden">
        {image ? (
          <>
            <img src={image} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-colors duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-colors duration-300" />
            <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border border-primary/10">
              <span className="text-4xl">{icon}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex-1">
            {name}
          </h3>
          {count !== undefined && (
            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {count}
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {description}
        </p>

        <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">
          <span>Explore</span>
          <span className="ml-1">→</span>
        </div>
      </div>
    </EnhancedCard>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}

// Info Card - For alerts and information
interface InfoCardProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

function InfoCard({ 
  variant = 'info', 
  title, 
  description, 
  icon: Icon,
  className 
}: InfoCardProps) {
  const variantStyles = {
    info: 'bg-blue-50/80 border-blue-200 text-blue-900',
    success: 'bg-green-50/80 border-green-200 text-green-900',
    warning: 'bg-yellow-50/80 border-yellow-200 text-yellow-900',
    error: 'bg-red-50/80 border-red-200 text-red-900',
  };

  const iconStyles = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  return (
    <div className={cn(
      "rounded-2xl border-2 p-4 backdrop-blur-sm",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={cn("flex-shrink-0", iconStyles[variant])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Empty State Card
interface EmptyStateCardProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyStateCard({ 
  icon: Icon, 
  emoji = '📦',
  title, 
  description, 
  action,
  className 
}: EmptyStateCardProps) {
  return (
    <EnhancedCard className={cn("p-12 text-center", className)}>
      <div className="max-w-sm mx-auto space-y-4">
        {Icon ? (
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
            <Icon className="w-10 h-10 text-gray-400" />
          </div>
        ) : (
          <div className="text-6xl mb-4">{emoji}</div>
        )}
        
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        
        {action && (
          <button
            onClick={action.onClick}
            className="mt-6 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            {action.label}
          </button>
        )}
      </div>
    </EnhancedCard>
  );
}

export {
  EnhancedCard,
  StatCard,
  ProductCard,
  FeatureCard,
  CategoryCard,
  InfoCard,
  EmptyStateCard,
}

