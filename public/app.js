document.getElementById('generateButton').addEventListener('click', async () => {
    const appIdea = document.getElementById('appIdea').value;
    
    if (appIdea) {
        // Send the app idea to the backend for processing
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idea: appIdea }),
        });

        const data = await response.json();
        
        // Check if there was an error
        if (response.ok) {
            // Display the generated code
            document.getElementById('codeDisplay').textContent = data.generatedCode;

            // Display the app preview in the iframe
            const appPreview = document.getElementById('appPreview');
            const blob = new Blob([data.generatedCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            appPreview.src = url;
        } else {
            alert(data.error || 'An error occurred while generating code.');
        }
    } else {
        alert('Please enter an app idea!');
    }
});
