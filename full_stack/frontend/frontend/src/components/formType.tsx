import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

export function FormType(label:string) {
    const title:string[] = label.split(" ");
    switch (title) {
        case title.includes('describe'):

    }
}


function textArea(label:string) {
    return(
        <div>
            <Label>{label}</Label>
            <Textarea placeholder={'Type your answer here'}></Textarea>
        </div>
    )
}
function selector(label:string) {
    return(
        <div>
            <Label>{label}</Label>
            <Select>
                <SelectTrigger className={'w-[280px]'}>
                    <SelectValue placeholder={"Select an option"}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Options</SelectLabel>
                        <SelectItem value={'option1'}>Option 1</SelectItem>
                        <SelectItem value={'option2'}>Option 2</SelectItem>
                        <SelectItem value={'option3'}>Option 3</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}