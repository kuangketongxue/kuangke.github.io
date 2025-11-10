#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import json
from datetime import datetime

def parse_markdown_to_json(md_file='weekly-review.md', json_file='weekly-data.json'):
    """
    将Markdown格式的周报转换为JSON格式
    """
    try:
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 分割各周内容
        weeks = re.split(r'\n## 第(\d+)周\n', content)
        
        reviews = []
        
        # 跳过第一个元素（文件头部）
        for i in range(1, len(weeks), 2):
            if i+1 >= len(weeks):
                break
                
            week_num = weeks[i]
            week_content = weeks[i+1]
            
            # 提取时间范围
            time_match = re.search(r'\*\*时间范围：\*\*\s*(.+)', week_content)
            week_range = time_match.group(1).strip() if time_match else ""
            
            # 提取目标
            goals = []
            goal_pattern = r'####\s+\d+\.\s+(.+?)\n-\s+\[([ x])\].*?\n-\s+\*\*说明：\*\*\s*(.*?)(?=\n####|\n###|$)'
            
            for match in re.finditer(goal_pattern, week_content, re.DOTALL):
                title = match.group(1).strip()
                completed = match.group(2) == 'x'
                description = match.group(3).strip()
                
                goals.append({
                    "title": title,
                    "description": description,
                    "completed": completed
                })
            
            # 提取总结部分
            summary_match = re.search(r'### 本周总结(.+?)(?=\n---|\n## |$)', week_content, re.DOTALL)
            summary = ""
            
            if summary_match:
                summary_content = summary_match.group(1).strip()
                
                # 提取各个部分
                data_match = re.search(r'#### 📊 数据回顾(.+?)(?=####|$)', summary_content, re.DOTALL)
                highlight_match = re.search(r'#### ✨ 亮点(.+?)(?=####|$)', summary_content, re.DOTALL)
                improve_match = re.search(r'#### ⚠️ 改进点(.+?)(?=####|$)', summary_content, re.DOTALL)
                plan_match = re.search(r'#### 💡 下周计划(.+?)(?=####|$)', summary_content, re.DOTALL)
                
                summary_parts = []
                if data_match:
                    summary_parts.append("📊 数据回顾" + data_match.group(1).strip())
                if highlight_match:
                    summary_parts.append("\n✨ 亮点" + highlight_match.group(1).strip())
                if improve_match:
                    summary_parts.append("\n⚠️ 改进点" + improve_match.group(1).strip())
                if plan_match:
                    summary_parts.append("\n💡 下周计划" + plan_match.group(1).strip())
                
                summary = "\n".join(summary_parts)
            
            reviews.append({
                "weekTitle": f"第{week_num}周",
                "weekRange": week_range,
                "goals": goals,
                "summary": summary
            })
        
        # 生成JSON
        output = {"reviews": reviews}
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 转换成功！")
        print(f"📄 输入文件: {md_file}")
        print(f"📄 输出文件: {json_file}")
        print(f"📊 共转换 {len(reviews)} 周的数据")
        
        return True
        
    except FileNotFoundError:
        print(f"❌ 错误：找不到文件 {md_file}")
        return False
    except Exception as e:
        print(f"❌ 转换失败: {str(e)}")
        return False

if __name__ == "__main__":
    parse_markdown_to_json()
