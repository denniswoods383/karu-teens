#!/bin/bash

# Add imports to files that use getAPIBaseURL but don't import it
FILES=$(grep -l "getAPIBaseURL" frontend/src -r --include="*.ts" --include="*.tsx" | xargs grep -L "import.*getAPIBaseURL")

for file in $FILES; do
    if [[ $file != *"ipDetection.ts"* ]] && [[ $file != *"api.ts"* ]]; then
        echo "Adding import to $file"
        sed -i "1i import { getAPIBaseURL } from '../utils/ipDetection';" "$file"
    fi
done

echo "✅ Imports added!"