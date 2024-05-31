
import * as DropdownMenu from 'zeego/dropdown-menu'
import RoundButton from '@/components/RoundButton';

const DropDown = () => {
  return (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <RoundButton icon={'ellipsis-horizontal'} text={'More'} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
            <DropdownMenu.Item key='statement'>
                <DropdownMenu.ItemTitle>Statement</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default DropDown