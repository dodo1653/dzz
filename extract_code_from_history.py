#!/usr/bin/env python3
"""
Extract all code blocks from conversation history files.
This script scans .md and .txt files and extracts complete code snippets with their file paths.
"""

import re
import os
from pathlib import Path

def extract_code_blocks(content):
    """Extract all code blocks from content."""
    blocks = []
    
    # Pattern to match file paths and code blocks
    # Looks for filePath or file path references followed by code blocks
    file_path_patterns = [
        r'"filePath":\s*"([^"]+)"',
        r'filePath:\s*`([^`]+)`',
        r'Wrote\s+([^\s]+\.(?:jsx?|css|json))',
        r'Read\s+([^\s]+\.(?:jsx?|css|json))',
    ]
    
    # Find all code blocks (triple backtick sections)
    code_block_pattern = r'```(?:\w+)?\n(.*?)```'
    
    current_file = None
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        # Check for file path
        for pattern in file_path_patterns:
            match = re.search(pattern, line)
            if match:
                current_file = match.group(1)
                break
        
        # Check for code block start
        if line.startswith('```') and current_file:
            # Find the end of this code block
            code_lines = []
            j = i + 1
            while j < len(lines) and not lines[j].startswith('```'):
                code_lines.append(lines[j])
                j += 1
            
            if code_lines:
                blocks.append({
                    'file': current_file,
                    'code': '\n'.join(code_lines),
                    'line_start': i + 1,
                    'line_end': j
                })
    
    return blocks

def extract_from_file_block(content):
    """Extract from <file> blocks which contain line numbers."""
    blocks = []
    
    # Pattern for <file> blocks
    file_pattern = r'<file>\s*\n?(.*?)\n?</file>'
    
    for match in re.finditer(file_pattern, content, re.DOTALL):
        file_content = match.group(1)
        
        # Extract file path from first line if present
        lines = file_content.strip().split('\n')
        if lines:
            # First line usually has line numbers like 00001|
            # Look for actual code
            code_lines = []
            for line in lines:
                # Remove line number prefix
                clean = re.sub(r'^\d+\|', '', line)
                code_lines.append(clean)
            
            blocks.append({
                'type': 'file_block',
                'content': '\n'.join(code_lines)
            })
    
    return blocks

def scan_directory(directory):
    """Scan all .md and .txt files in directory."""
    results = {}
    
    for ext in ['*.md', '*.txt']:
        for filepath in Path(directory).glob(ext):
            print(f"Scanning {filepath.name}...")
            
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Extract code blocks
            blocks = extract_code_blocks(content)
            
            if blocks:
                results[filepath.name] = blocks
    
    return results

def save_extracted_files(blocks_by_file, output_dir):
    """Save extracted code to files."""
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Track files we've extracted
    extracted = {}
    
    for source_file, blocks in blocks_by_file.items():
        for block in blocks:
            filepath = block.get('file', '')
            code = block.get('code', '')
            
            if filepath and code:
                # Normalize path
                filepath = filepath.replace('D:\\Users\\dodsa\\Documents\\ai-degen-radar\\', '')
                filepath = filepath.replace('D:/Users/dodsa/Documents/ai-degen-radar/', '')
                
                if filepath not in extracted or len(code) > len(extracted[filepath]):
                    extracted[filepath] = code
    
    # Write files
    for filepath, code in extracted.items():
        full_path = output_path / filepath
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(code)
        
        print(f"Extracted: {filepath}")

def main():
    # Directory containing history files
    history_dir = r'D:\Users\dodsa\Documents\ai-degen-radar'
    output_dir = r'D:\Users\dodsa\Documents\ai-degen-radar\extracted_files'
    
    print("=" * 60)
    print("CONVERSATION HISTORY CODE EXTRACTOR")
    print("=" * 60)
    
    # Scan all history files
    results = scan_directory(history_dir)
    
    # Save extracted files
    save_extracted_files(results, output_dir)
    
    print("\n" + "=" * 60)
    print(f"Extraction complete. Files saved to: {output_dir}")
    print("=" * 60)

if __name__ == '__main__':
    main()
