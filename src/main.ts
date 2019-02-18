import {getAllMembers, addMemberToDb, updateMember} from './firebase';

let members = getAllMembers();

const memberHtmlTemplate = `
<tr class="normal member-row-{{indexPlaceHolder}}">
	<td>
		<span class="normal member-name-{{indexPlaceHolder}}">{{namePlaceholder}}</span>
		<span class="edit"><input id="placeholderName-{{indexPlaceHolder}}" type="text" value="{{namePlaceholder}}" onchange="updateNameValue({{indexPlaceHolder}})"/></span>
	</td>
	<td>
		<span data-status-value="{{statusValuePlaceHolder}}" class="normal member-status-value-{{indexPlaceHolder}}">{{statusPlaceHolder}}</span>
		<span class="edit">
			<select name="status" id="memberStatus-{{indexPlaceHolder}}" onchange="updateStatusValue({{indexPlaceHolder}})">
				<option value="TEAM">בצוות</option>
				<option value="MEETING">בפגישה</option>
				<option value="VACATION">בחופש</option>
				<option value="DUTY">בתורנות</option>
				<option value="OUT">יצאתי לכמה דקות</option>
			</select>
		</span>
	</td>
	<td>
		<span class="normal">
			<p class="normal" data-placement="top" data-toggle="tooltip" title="Edit"><button onclick="toggleEditMode({{indexPlaceHolder}})" class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" ><span class="glyphicon glyphicon-pencil"></button></p>
		</span>
		<span class="edit edit-submit-{{indexPlaceHolder}}">
			<i class="clickable glyphicon glyphicon-check edit-element" onclick="updateMember()"></i>	
		</span>
	</td>
	<td>
		<p class="normal" data-placement="top" data-toggle="tooltip" title="Delete">
			<button onclick="findMemberName({{indexPlaceHolder}})" class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete" >
				<span class="glyphicon glyphicon-trash">
				</span>
			</button>
		</p>
		<span class="edit">
		</span>
	</td>
				</tr>
`;

const statusDictionary = {
	"TEAM": "בצוות",
	"OUT": "יצאתי לכמה דקות",
	"VACATION": "בחופש",
	"DUTY": "בתורנות",
	"MEETING": "בפגישה"
};



export async function getMembers() {
	try {
		const members = await getAllMembers();
		renderMembers(members as any);
		return members;
		
	} catch (error) {
		console.error(`Error in getMembers: ${error}`)
		throw error;	
	}
		

}

export function handleAddMember(e) {

	const name = (document.getElementById('memberName') as any).value;
	const status = (document.getElementById('memberStatus') as any).value;

	if (name.length > 0) {
		addMemberToDb(name, status)
			.then(msg => {
				console.log('member added');
				getMembers();
				document.getElementById('addMemberForm').style.display = 'none';
				document.getElementById('addMember').style.display = 'block';
			})
			.catch(err => console.error(err));
	}
}

export function showAddMemberForm() {
	document.getElementById('addMember').style.display = 'none';
	document.getElementById('addMemberForm').style.display = 'block';
}

export function renderMembers(members = []) {
	const membersContainer = document.getElementById('tBodyContainer');

	membersContainer.innerHTML = '';

	for (let index = 0; index < members.length; index++) {
		const member = members[index];
		membersContainer.innerHTML += memberHtmlTemplate
			.replace(/{{namePlaceholder}}/g, member.name)
			.replace(/{{statusPlaceHolder}}/g, statusDictionary[member.status])
			.replace(/{{statusValuePlaceHolder}}/g, member.status)
			.replace(/{{indexPlaceHolder}}/g, index.toString());
	}
}


function toggleEditMode(index) {
	document.querySelector('.member-row-' + index).classList.replace('normal', 'edit');
	
	document.querySelector('.edit-submit-' + index).addEventListener('click', () => {
		const statusValue = document.querySelector('.member-status-value-' + index).getAttribute('data-status-value');
		(document.querySelector('#memberStatus-' + index) as any).value = statusValue;
		const nameValue = (document.querySelector('#placeholderName-' + index) as any).value;
		
		updateMember(nameValue, statusValue);
	});

 }

 function updateStatusValue(index) {
	  return (document.querySelector('#memberStatus-' + index) as any).value;
 }

 function updateNameValue(index) {
	return (document.querySelector('#placeholderName-' + index) as any).value;
 }