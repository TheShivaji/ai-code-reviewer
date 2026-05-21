export const detectLanguage = (code) => {
    const patterns = {
        javascript: ['const ', 'let ', 'var ', 'console.log', 'require('],
        python: ['def ', 'import ', 'print(', 'elif ', 'self.'],
        typescript: ['interface ', ': string', ': number', ': boolean', 'as '],
        java: ['public class', 'System.out', 'void ', 'import java', '@Override'],
        cpp: ['#include', 'cout <<', 'std::', 'int main()', 'cin >>'],
        go: ['func ', 'fmt.', 'package main', ':= ', 'var '],
    }

    for (const [lang, keywords] of Object.entries(patterns)) {
        const matches = keywords.filter(k => code.includes(k)).length
        if (matches >= 2) return lang
    }

    return 'javascript'
}