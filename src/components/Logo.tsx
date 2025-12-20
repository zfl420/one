interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 40, className }: LogoProps) {
  // 使用固定的 viewBox 坐标系统，便于缩放
  // 根据 Google One logo 的实际比例调整
  const viewBoxWidth = 140
  const viewBoxHeight = 40
  const letterSize = 30 // 字母大小，与 O 圆圈高度匹配
  const letterSpacing = 4 // 字母间距
  const centerY = viewBoxHeight / 2 // 垂直中心
  
  // O 字母：蓝色外圈 + 白色中圈 + 绿色内圈
  // 根据 Google One logo，O 的高度应该与字母高度一致
  const oRadius = letterSize / 2 // O 的外圈半径等于字母高度的一半
  const oWhiteRadius = oRadius * 0.6 // 白色圆圈半径，形成明显的白色环
  const oInnerRadius = oRadius * 0.32 // 绿色内圈半径，约为外圈的 32%
  const oX = oRadius + 2 // O 的 x 位置，留出一点边距
  
  // n 字母位置：紧跟在 O 后面
  const nX = oX + oRadius + letterSpacing
  
  // e 字母位置：紧跟在 n 后面
  const eX = nX + letterSize * 0.65 + letterSpacing * 0.5

  // 计算实际 SVG 宽度
  const svgWidth = (viewBoxWidth / viewBoxHeight) * size
  const svgHeight = size

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* e 字母左半部分裁剪路径（精确分割） */}
        <clipPath id="eLeftClip">
          <rect
            x={eX - letterSize * 0.5}
            y={centerY - letterSize * 0.7}
            width={letterSize * 0.5}
            height={letterSize * 1.4}
          />
        </clipPath>
        {/* e 字母右半部分裁剪路径（精确分割） */}
        <clipPath id="eRightClip">
          <rect
            x={eX}
            y={centerY - letterSize * 0.7}
            width={letterSize * 0.5}
            height={letterSize * 1.4}
          />
        </clipPath>
      </defs>

      {/* O 字母：蓝色外圈 */}
      <circle
        cx={oX}
        cy={centerY}
        r={oRadius}
        fill="#4285F4" // Google Blue #4285F4
      />
      
      {/* O 字母：白色圆环（通过白色圆圈覆盖蓝色形成） */}
      <circle
        cx={oX}
        cy={centerY}
        r={oWhiteRadius}
        fill="#FFFFFF" // White #FFFFFF
      />
      
      {/* O 字母：绿色内圈（覆盖白色中心） */}
      <circle
        cx={oX}
        cy={centerY}
        r={oInnerRadius}
        fill="#34A853" // Google Green #34A853
      />

      {/* n 字母：红色 */}
      <text
        x={nX}
        y={centerY}
        fontSize={letterSize}
        fill="#EA4335" // Google Red #EA4335
        fontWeight="700" // Bold
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        dominantBaseline="middle"
        style={{ letterSpacing: 0 }}
      >
        n
      </text>

      {/* e 字母左半部分：红色 */}
      <text
        x={eX}
        y={centerY}
        fontSize={letterSize}
        fill="#EA4335" // Google Red #EA4335
        fontWeight="700" // Bold
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        dominantBaseline="middle"
        clipPath="url(#eLeftClip)"
        style={{ letterSpacing: 0 }}
      >
        e
      </text>
      
      {/* e 字母右半部分：黄色 */}
      <text
        x={eX}
        y={centerY}
        fontSize={letterSize}
        fill="#FBBC04" // Google Yellow #FBBC04
        fontWeight="700" // Bold
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        dominantBaseline="middle"
        clipPath="url(#eRightClip)"
        style={{ letterSpacing: 0 }}
      >
        e
      </text>
    </svg>
  )
}

