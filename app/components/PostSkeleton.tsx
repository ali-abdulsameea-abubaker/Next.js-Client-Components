// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

/**
 * PostSkeleton element for the status of loading
 */
export default function PostSkeleton() {
  return (
    <div className="post skeleton">
      <div className="post-header">
        <div className="avatar skeleton-avatar"></div>
        <div className="user-info">
          <div className="skeleton-line" style={{width: '120px', height: '16px'}}></div>
          <div className="skeleton-line" style={{width: '80px', height: '12px', marginTop: '4px'}}></div>
        </div>
      </div>
      <div className="skeleton-line" style={{width: '100%', height: '16px', marginBottom: '8px'}}></div>
      <div className="skeleton-line" style={{width: '80%', height: '16px', marginBottom: '8px'}}></div>
      <div className="skeleton-line" style={{width: '60%', height: '16px', marginBottom: '16px'}}></div>
      <div className="post-actions">
        <div className="skeleton-line" style={{width: '60px', height: '32px'}}></div>
        <div className="skeleton-line" style={{width: '60px', height: '32px'}}></div>
        <div className="skeleton-line" style={{width: '60px', height: '32px'}}></div>
      </div>
    </div>
  );
}