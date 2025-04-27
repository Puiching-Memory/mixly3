import itertools
import time

def calculate(numbers, operators):
    # 计算四个数与三个运算符的组合是否能得到24
    formula = f"{numbers[0]} {operators[0]} {numbers[1]} {operators[1]} {numbers[2]} {operators[2]} {numbers[3]}"
    result = eval(formula)
    if result == 24:
        return True, formula
    else:
        return False, result

def solve(nums):
    start_time = time.time()  # 记录开始时间
    count = 0  # 记录枚举次数
    

    # 枚举三个运算符的所有排列组合（有重复）
    for ops in itertools.product(["+", "-", "*", "/"], repeat=3):
        count += 1
        success, result = calculate(nums, ops)
        if success:
            print(f"第{count}次枚举成功：{nums[0]} {ops[0]} {nums[1]} {ops[1]} {nums[2]} {ops[2]} {nums[3]} = 24")
            print(f"共枚举{count}次，耗时{time.time()-start_time:.3f}秒。")
            return
        else:
            print(f"第{count}次枚举失败：{nums[0]} {ops[0]} {nums[1]} {ops[1]} {nums[2]} {ops[2]} {nums[3]} = {result}")
    
    print("无解")
    print(f"共枚举{count}次，耗时{time.time()-start_time:.3f}秒。")

def get_numbers_from_user():
    numbers = []
    for i in range(4):
        while True:
            try:
                num = int(input(f"请输入第{i+1}个数字："))
                numbers.append(num)
                break
            except ValueError:
                print("输入错误，请重新输入整数。")
    return numbers

def main():
    print("欢迎使用24点计算器！")
    numbers = get_numbers_from_user()
    print("开始求解...")
    solve(numbers)

if __name__ == "__main__":
    main()