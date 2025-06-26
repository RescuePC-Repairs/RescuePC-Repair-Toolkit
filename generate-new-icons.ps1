# Generate new round icons from New Logo.png
$sourceLogo = "assets\icons\New Logo.png"
$iconSizes = @(16, 32, 72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "Generating round icons from New Logo.png..."

foreach ($size in $iconSizes) {
    $outputFile = "assets\icons\icon-$($size)x$($size).png"
    
    # Use PowerShell to resize image (basic approach)
    try {
        Add-Type -AssemblyName System.Drawing
        $source = [System.Drawing.Image]::FromFile($sourceLogo)
        
        # Create a new bitmap with the target size
        $bitmap = New-Object System.Drawing.Bitmap($size, $size)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        
        # Set high quality rendering
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        
        # Create a circular clipping path
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse(0, 0, $size, $size)
        $graphics.SetClip($path)
        
        # Draw the source image scaled to fit the circle
        $graphics.DrawImage($source, 0, 0, $size, $size)
        
        # Save the round icon
        $bitmap.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Clean up
        $graphics.Dispose()
        $bitmap.Dispose()
        $source.Dispose()
        
        Write-Host "Created round icon: $outputFile"
    }
    catch {
        Write-Host "Error creating $outputFile"
    }
}

# Create round favicon.ico
try {
    Add-Type -AssemblyName System.Drawing
    $source = [System.Drawing.Image]::FromFile($sourceLogo)
    
    # Create a 32x32 round favicon
    $bitmap = New-Object System.Drawing.Bitmap(32, 32)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Set high quality rendering
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    # Create a circular clipping path
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(0, 0, 32, 32)
    $graphics.SetClip($path)
    
    # Draw the source image scaled to fit the circle
    $graphics.DrawImage($source, 0, 0, 32, 32)
    
    # Save as ICO
    $bitmap.Save("assets\icons\favicon.ico", [System.Drawing.Imaging.ImageFormat]::Icon)
    
    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()
    $source.Dispose()
    
    Write-Host "Created round favicon: assets\icons\favicon.ico"
}
catch {
    Write-Host "Error creating favicon.ico"
}

Write-Host "Round icon generation complete!" 